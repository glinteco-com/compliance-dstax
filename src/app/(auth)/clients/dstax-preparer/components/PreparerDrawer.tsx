'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import FormController from '@/components/form/FormController'
import { CommonSelect } from '@/components/select/CommonSelect'
import { CommonCombobox } from '@/components/select/CommonCombobox'
import { Loading } from '@/components/loading/Loading'
import { User } from '@/models/user'
import { useApiCoreUserRetrieve } from '@/api/generated/core-user/core-user'
import { useLegalEntities } from '@/app/(auth)/clients/legal-entities/hooks/useLegalEntities'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'

type UserWithId = User & { id: number }

const formSchema = z.object({
  managed_client: z.string().optional(),
  assigned_legal_entity_ids: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface PreparerDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit' | 'view'
  selectedItem: UserWithId | null
  clientOptions: { value: string; label: string }[]
  clientMap: Record<number, string>
  onSubmit: (data: FormValues, mode: 'create' | 'edit') => void
  isSaving: boolean
}

export function PreparerDrawer({
  open,
  onOpenChange,
  mode,
  selectedItem,
  clientOptions,
  clientMap,
  onSubmit: onSubmitProp,
  isSaving,
}: PreparerDrawerProps) {
  const portalContainerRef = React.useRef<HTMLDivElement | null>(null)
  const { control, reset, handleSubmit, watch, setValue } = useForm<FormValues>(
    {
      resolver: zodResolver(formSchema),
      defaultValues: {
        managed_client: '',
        assigned_legal_entity_ids: [],
      },
    }
  )

  const managedClient = watch('managed_client')
  const prevClientRef = React.useRef(managedClient)

  React.useEffect(() => {
    if (prevClientRef.current !== managedClient) {
      setValue('assigned_legal_entity_ids', [])
      prevClientRef.current = managedClient
    }
  }, [managedClient, setValue])

  const { data: legalEntitiesData } = useLegalEntities({
    page: 1,
    pageSize: 100,
    clientId: managedClient ? Number(managedClient) : undefined,
  })

  React.useEffect(() => {
    if (!open) return

    if (mode === 'create') {
      reset({
        managed_client: '',
        assigned_legal_entity_ids: [],
      })
    }
  }, [open, mode, selectedItem, reset])

  const { data: preparerDetail, isLoading: isLoadingDetail } =
    useApiCoreUserRetrieve(selectedItem?.id ?? 0, {
      query: {
        enabled: (mode === 'view' || mode === 'edit') && !!selectedItem?.id,
      },
    })

  const detail = preparerDetail as unknown as UserWithId | undefined

  const legalEntityOptions = React.useMemo(() => {
    const fromData = (legalEntitiesData?.results ?? [])
      .filter((le: { id?: number }) => le.id != null)
      .map((le: { id: number; name: string }) => ({
        value: String(le.id),
        label: le.name,
      }))

    if (mode === 'edit' && detail?.assigned_legal_entities) {
      const existingIds = new Set(fromData.map((o) => o.value))
      for (const le of detail.assigned_legal_entities) {
        if (le.id != null && !existingIds.has(String(le.id))) {
          fromData.push({ value: String(le.id), label: le.name })
        }
      }
    }

    return fromData
  }, [legalEntitiesData, mode, detail])

  React.useEffect(() => {
    if (mode === 'edit' && detail) {
      const clientValue = detail.managed_client
        ? String(detail.managed_client)
        : ''
      prevClientRef.current = clientValue
      reset({
        managed_client: clientValue,
        assigned_legal_entity_ids: [],
      })
    }
  }, [mode, detail, reset])

  React.useEffect(() => {
    if (mode === 'edit' && detail && legalEntitiesData) {
      const ids = detail.assigned_legal_entity_ids?.map(String) ?? []
      setValue('assigned_legal_entity_ids', ids)
    }
  }, [mode, detail, legalEntitiesData, setValue])

  const onFormSubmit = (formData: FormValues) => {
    onSubmitProp(formData, mode as 'create' | 'edit')
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent ref={portalContainerRef}>
        <DrawerHeader>
          <DrawerTitle>
            {mode === 'create' && 'Add Preparer'}
            {mode === 'edit' && 'Edit Preparer'}
            {mode === 'view' && 'Preparer Details'}
          </DrawerTitle>
          <DrawerDescription>
            {mode === 'create' && 'Enter the details of the new preparer.'}
            {mode === 'edit' && 'Update the details of the selected preparer.'}
            {mode === 'view' &&
              'Here are the details of the selected preparer.'}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-auto p-4">
          {mode === 'view' && selectedItem && (
            <>
              {isLoadingDetail ? (
                <Loading text="Loading preparer details..." />
              ) : detail ? (
                <div className="space-y-4 text-sm">
                  <div className="grid gap-1">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      ID
                    </span>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {detail.id}
                    </span>
                  </div>
                  <div className="grid gap-1">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Role
                    </span>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      DSTax Preparer
                    </span>
                  </div>
                  <div className="grid gap-1">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Managed Client
                    </span>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {detail.managed_client
                        ? (clientMap[detail.managed_client] ??
                          detail.managed_client)
                        : '—'}
                    </span>
                  </div>
                  <div className="grid gap-1">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Assigned Legal Entities
                    </span>
                    {detail.assigned_legal_entities?.length ? (
                      <ul className="list-disc pl-5 text-zinc-600 dark:text-zinc-400">
                        {detail.assigned_legal_entities.map((le) => (
                          <li key={le.name}>{le.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-zinc-600 dark:text-zinc-400">
                        —
                      </span>
                    )}
                  </div>
                </div>
              ) : null}
            </>
          )}

          {(mode === 'create' || mode === 'edit') && (
            <form
              id="preparer-form"
              onSubmit={handleSubmit(onFormSubmit)}
              className="mt-2 space-y-4"
            >
              <FormController
                control={control}
                name="managed_client"
                Field={CommonSelect}
                fieldProps={{
                  label: 'Managed Client',
                  placeholder: 'Select a client',
                  options: clientOptions,
                }}
              />
              <FormController
                control={control}
                name="assigned_legal_entity_ids"
                Field={CommonCombobox}
                fieldProps={{
                  label: 'Assigned Legal Entities',
                  placeholder: 'Select legal entities',
                  options: legalEntityOptions,
                  portalContainer: portalContainerRef,
                }}
              />
            </form>
          )}
        </div>

        <DrawerFooter>
          {(mode === 'create' || mode === 'edit') && (
            <Button type="submit" form="preparer-form" disabled={isSaving}>
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
