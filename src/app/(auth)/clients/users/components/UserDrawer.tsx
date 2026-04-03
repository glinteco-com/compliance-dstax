import * as React from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import FormController from '@/components/form/FormController'
import { CommonSelect } from '@/components/select/CommonSelect'
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
import { User } from '@/models/user'
import { getApiErrorMessage } from '@/lib/utils'

const ROLE_LABELS: Record<string, string> = {
  DSTAX_ADMIN: 'DSTax Admin',
  DSTAX_PREPARER: 'DSTax Preparer',
  CLIENT_ADMIN: 'Client Admin',
  CLIENT_STAFF: 'Client Staff',
}

const formSchema = z.object({
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
  clientOptions: { value: string; label: string }[]
  clientMap: Record<number, string>
}

export function UserDrawer({
  open,
  onOpenChange,
  mode,
  userId,
  onSuccess,
  clientOptions,
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

  const containerRef = React.useRef<HTMLDivElement>(null)

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

  const { control, reset, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: '',
      managed_client: '',
      assigned_legal_entity_ids: [],
    },
  })

  const formManagedClient = useWatch({
    control,
    name: 'managed_client',
  })

  // Fetch legal entities for the selected managed client
  const { data: legalEntitiesData, isLoading: isFetchingLegalEntities } =
    useApiCoreLegalEntityList(
      {
        client: formManagedClient ? Number(formManagedClient) : undefined,
        page_size: 100,
      },
      {
        query: {
          enabled: open && !!formManagedClient,
        },
      }
    )

  const legalEntityOptions = React.useMemo(() => {
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

  React.useEffect(() => {
    if (open) {
      if (currentMode === 'create') {
        reset({
          role: '',
          managed_client:
            !canEditManagedClient && sessionUser?.managed_client?.id
              ? String(sessionUser.managed_client.id)
              : '',
          assigned_legal_entity_ids: [],
        })
      } else if (userData) {
        reset({
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
  }, [open, currentMode, userData, reset])

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
                Field={CommonSelect}
                fieldProps={{
                  label: 'Managed Client',
                  placeholder: 'Select a client',
                  options: clientOptions,
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
