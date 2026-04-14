import { useRef, useEffect, useMemo, useState, useCallback } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FormController from '@/components/form/FormController'
import { CommonSelect } from '@/components/select/CommonSelect'
import { SearchableSelect } from '@/components/select/SearchableSelect'
import { CommonCombobox } from '@/components/select/CommonCombobox'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useSessionStore } from '@/store/useSessionStore'
import { RoleEnum } from '@/models/roleEnum'
import {
  useApiCoreUserCreate,
  useApiCoreUserUpdate,
  useApiCoreUserRetrieve,
} from '@/api/generated/core-user/core-user'
import { useApiCoreLegalEntityList } from '@/api/generated/core-legal-entity/core-legal-entity'
import { useApiCoreClientList } from '@/api/generated/core-client/core-client'
import { User } from '@/models/user'
import { PaginatedClientList } from '@/models/paginatedClientList'
import { getApiErrorMessage } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'

const ROLE_LABELS: Record<string, string> = {
  DSTAX_ADMIN: 'DSTax Admin',
  DSTAX_PREPARER: 'DSTax Preparer',
  CLIENT_ADMIN: 'Client Admin',
  CLIENT_STAFF: 'Client Staff',
}

const formSchema = z.object({
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  password: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
  managed_client: z.string().optional(),
  assigned_legal_entity_ids: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface UserDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit' | 'view'
  userId: number | null
  onSuccess: () => void
  clientMap: Record<number, string>
}

const CLIENT_PAGE_SIZE = 5

export function UserDrawer({
  open,
  onOpenChange,
  mode,
  userId,
  onSuccess,
  clientMap,
}: UserDrawerProps) {
  const { user: sessionUser } = useSessionStore()

  const isDstaxAdmin = sessionUser?.is_dstax_admin ?? false
  const isDstaxPreparer = sessionUser?.is_dstax_preparer ?? false
  const isClientAdmin = sessionUser?.is_client_admin ?? false
  const isClientStaff = sessionUser?.is_client_staff ?? false

  const canEditManagedClient = isDstaxAdmin
  const canEditLegalEntities = isDstaxAdmin || isDstaxPreparer || isClientAdmin
  const canEditRole = isDstaxAdmin
  const canUseEditFeature = !isClientStaff

  // Force mode to "view" if user doesn't have edit permission and is trying to edit
  const currentMode = mode === 'edit' && !canUseEditFeature ? 'view' : mode

  const containerRef = useRef<HTMLDivElement>(null)

  // Client search state for managed_client SearchableSelect
  const [clientSearchQuery, setClientSearchQuery] = useState('')
  const [clientPage, setClientPage] = useState(1)
  const [accumulatedClientOptions, setAccumulatedClientOptions] = useState<
    { value: string; label: string }[]
  >([])
  const debouncedClientSearch = useDebounce(clientSearchQuery, 400)

  const { data: clientsData, isFetching: isFetchingClients } =
    useApiCoreClientList(
      {
        name__icontains: debouncedClientSearch || undefined,
        page: clientPage,
        page_size: CLIENT_PAGE_SIZE,
      },
      { query: { enabled: open && canEditManagedClient } }
    )

  useEffect(() => {
    const paginated = clientsData as unknown as PaginatedClientList
    if (!paginated) return
    const mapped = (paginated.results as { id: number; name: string }[]).map(
      (client) => ({ value: String(client.id), label: client.name })
    )
    const isFirstPage = !paginated.previous
    setAccumulatedClientOptions((previous) =>
      isFirstPage ? mapped : [...previous, ...mapped]
    )
  }, [clientsData])

  const clientHasMore =
    ((clientsData as unknown as PaginatedClientList)?.next ?? null) !== null

  const handleClientSearch = useCallback((query: string) => {
    setClientSearchQuery(query)
    setClientPage(1)
  }, [])

  const handleClientLoadMore = useCallback(() => {
    setClientPage((previous) => previous + 1)
  }, [])

  useEffect(() => {
    if (!open) {
      setClientSearchQuery('')
      setClientPage(1)
      setAccumulatedClientOptions([])
    }
  }, [open])

  const { data: userData, isLoading: isFetchingUser } = useApiCoreUserRetrieve(
    userId as number,
    {
      query: {
        enabled: open && !!userId && currentMode !== 'create',
      },
    }
  )

  const roleOptions = Object.entries(RoleEnum).map(([, value]) => ({
    value,
    label: ROLE_LABELS[value] ?? value,
  }))

  const { control, reset, handleSubmit, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      role: '',
      managed_client: '',
      assigned_legal_entity_ids: [],
    },
  })

  const formManagedClient = useWatch({
    control,
    name: 'managed_client',
  })

  // Fetch legal entities filtered by managed client
  const { data: legalEntitiesData, isLoading: isFetchingLegalEntities } =
    useApiCoreLegalEntityList(
      {
        page_size: 100,
        client: formManagedClient ? Number(formManagedClient) : undefined,
      },
      {
        query: {
          enabled: open && !!formManagedClient,
        },
      }
    )

  // Reset legal entities when managed client changes (unless we are just initializing the form)
  useEffect(() => {
    if (open && currentMode === 'create' && formManagedClient) {
      setValue('assigned_legal_entity_ids', [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formManagedClient])

  const legalEntityOptions = useMemo(() => {
    const list = legalEntitiesData?.results ?? []
    const options = list.map((le: any) => ({
      value: String(le.id),
      label: le.name,
    }))

    if (currentMode === 'edit' && userData?.assigned_legal_entities) {
      const existingIds = new Set(options.map((o: any) => o.value))
      for (const le of userData.assigned_legal_entities) {
        if (le.id != null && !existingIds.has(String(le.id))) {
          options.push({ value: String(le.id), label: le.name })
        }
      }
    }

    return options
  }, [legalEntitiesData, currentMode, userData])

  useEffect(() => {
    if (open) {
      if (currentMode === 'create') {
        reset({
          email: '',
          first_name: '',
          last_name: '',
          password: '',
          role: '',
          managed_client:
            !canEditManagedClient && sessionUser?.managed_client?.id
              ? String(sessionUser.managed_client.id)
              : '',
          assigned_legal_entity_ids: [],
        })
      } else if (userData) {
        reset({
          email: (userData as any).email || '',
          first_name: (userData as any).first_name || '',
          last_name: (userData as any).last_name || '',
          role: userData.role,
          managed_client: userData.managed_client
            ? typeof userData.managed_client === 'object'
              ? String((userData.managed_client as any).id)
              : String(userData.managed_client)
            : '',
          assigned_legal_entity_ids: userData.assigned_legal_entities?.length
            ? userData.assigned_legal_entities.map((le: any) => String(le.id))
            : [],
        })
      }
    }
  }, [open, currentMode, userData, reset, canEditManagedClient, sessionUser])

  const { mutate: createUser, isPending: isCreating } = useApiCoreUserCreate({
    mutation: {
      onSuccess: () => {
        toast.success('User created successfully.')
        onSuccess()
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to create user.'))
      },
    },
  })

  const { mutate: updateUser, isPending: isUpdating } = useApiCoreUserUpdate({
    mutation: {
      onSuccess: () => {
        toast.success('User updated successfully.')
        onSuccess()
        onOpenChange(false)
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error, 'Failed to update user.'))
      },
    },
  })

  const onSubmit = (formData: FormValues) => {
    if (!canUseEditFeature) return

    const selectedEntities = formData.assigned_legal_entity_ids || []
    const entityIds = selectedEntities
      .map((id) => Number(id))
      .filter((id) => !isNaN(id))

    const payload = {
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      password: formData.password || undefined,
      role: formData.role as User['role'],
      managed_client: formData.managed_client
        ? Number(formData.managed_client)
        : null,
      assigned_legal_entity_ids: entityIds,
    }

    if (currentMode === 'create') {
      createUser({ data: payload as any })
    } else if (currentMode === 'edit' && userId) {
      updateUser({
        id: userId,
        data: payload as any,
      })
    }
  }

  const isSaving = isCreating || isUpdating
  const isDisablingForm = currentMode !== 'create' && isFetchingUser

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {currentMode === 'create' && 'Add User'}
            {currentMode === 'edit' && 'Edit User'}
            {currentMode === 'view' && 'User Details'}
          </DrawerTitle>
          <DrawerDescription>
            {currentMode === 'create' && 'Enter the details of the new user.'}
            {currentMode === 'edit' &&
              'Update the details of the selected user.'}
            {currentMode === 'view' &&
              'Here are the details of the selected user.'}
          </DrawerDescription>
        </DrawerHeader>

        <div ref={containerRef} className="flex-1 overflow-auto p-4">
          {currentMode === 'view' && isFetchingUser && (
            <div className="text-sm text-zinc-500">Loading user details...</div>
          )}
          {currentMode === 'view' && !isFetchingUser && userData && (
            <div className="space-y-4 text-sm">
              <div className="grid gap-1">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  ID
                </span>
                <span className="text-zinc-600 dark:text-zinc-400">
                  {userData.id}
                </span>
              </div>
              <div className="grid gap-1">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Role
                </span>
                <span className="text-zinc-600 dark:text-zinc-400">
                  {ROLE_LABELS[userData.role] ?? userData.role}
                </span>
              </div>
              <div className="grid gap-1">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Managed Client
                </span>
                <span className="text-zinc-600 dark:text-zinc-400">
                  {userData.managed_client
                    ? typeof userData.managed_client === 'object'
                      ? (userData.managed_client as any).name
                      : (clientMap[userData.managed_client as any] ??
                        String(userData.managed_client))
                    : '—'}
                </span>
              </div>
              <div className="grid gap-1">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Assigned Legal Entities
                </span>
                {userData.assigned_legal_entities?.length ? (
                  <ul className="list-disc pl-4 text-zinc-600 dark:text-zinc-400">
                    {userData.assigned_legal_entities.map(
                      (le: any, i: number) => (
                        <li key={i}>{le.name}</li>
                      )
                    )}
                  </ul>
                ) : (
                  <span className="text-zinc-600 dark:text-zinc-400">—</span>
                )}
              </div>
            </div>
          )}

          {(currentMode === 'create' || currentMode === 'edit') && (
            <form
              id="user-form"
              onSubmit={handleSubmit(onSubmit)}
              className="mt-2 space-y-4"
            >
              <>
                <FormController
                  control={control}
                  name="email"
                  Field={Input}
                  fieldProps={{
                    label: 'Email',
                    placeholder: 'Enter email address',
                    type: 'email',
                  }}
                />
                <div className="flex gap-4">
                  <FormController
                    control={control}
                    name="first_name"
                    Field={Input}
                    fieldProps={{
                      containerClassName: 'flex-1',
                      label: 'First Name',
                      placeholder: 'Enter first name',
                    }}
                  />
                  <FormController
                    control={control}
                    name="last_name"
                    Field={Input}
                    fieldProps={{
                      containerClassName: 'flex-1',
                      label: 'Last Name',
                      placeholder: 'Enter last name',
                    }}
                  />
                </div>
                {currentMode === 'create' && (
                  <FormController
                    control={control}
                    name="password"
                    Field={Input}
                    fieldProps={{
                      label: 'Password',
                      placeholder: 'Enter password',
                      type: 'password',
                    }}
                  />
                )}
              </>
              <FormController
                control={control}
                name="role"
                Field={CommonSelect}
                fieldProps={{
                  label: 'Role',
                  placeholder: 'Select a role',
                  options: roleOptions,
                  disabled: !canEditRole || isDisablingForm,
                }}
              />
              <FormController
                control={control}
                name="managed_client"
                Field={SearchableSelect}
                fieldProps={{
                  label: 'Managed Client',
                  placeholder: 'Select a client',
                  options: accumulatedClientOptions,
                  onSearch: handleClientSearch,
                  onLoadMore: handleClientLoadMore,
                  hasMore: clientHasMore,
                  loading: isFetchingClients,
                  pageSize: CLIENT_PAGE_SIZE,
                  disabled: !canEditManagedClient || isDisablingForm,
                }}
              />
              <FormController
                control={control}
                name="assigned_legal_entity_ids"
                Field={CommonCombobox}
                fieldProps={{
                  label: 'Assigned Legal Entities',
                  placeholder: isFetchingLegalEntities
                    ? 'Loading options...'
                    : 'Select legal entities',
                  options: legalEntityOptions,
                  disabled: !canEditLegalEntities || isDisablingForm,
                  portalContainer: containerRef,
                }}
              />
            </form>
          )}
        </div>

        <DrawerFooter>
          {(currentMode === 'create' || currentMode === 'edit') &&
            canUseEditFeature && (
              <Button
                type="submit"
                form="user-form"
                disabled={
                  isSaving || (currentMode === 'edit' && isFetchingUser)
                }
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            )}
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
