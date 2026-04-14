'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CommonSelect } from '@/components/select/CommonSelect'
import { SearchableSelect } from '@/components/select/SearchableSelect'
import FormController from '@/components/form/FormController'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  useApiCoreLegalEntityCreate,
  getApiCoreLegalEntityListQueryKey,
} from '@/api/generated/core-legal-entity/core-legal-entity'
import { getApiErrorMessage } from '@/lib/utils'

interface ClientOption {
  value: string
  label: string
}

interface CreateLegalEntityDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientOptions: ClientOption[]
  /** Pre-selects and hides the client field when provided. */
  defaultClientId?: string
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Must be 255 characters or less'),
  client_id: z.string().min(1, 'Client is required'),
  is_active: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function CreateLegalEntityDrawer({
  open,
  onOpenChange,
  clientOptions,
  defaultClientId,
}: CreateLegalEntityDrawerProps) {
  const queryClient = useQueryClient()

  const { control, reset, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      client_id: '',
      is_active: 'true',
    },
  })

  const { mutate: createLegalEntity, isPending: isCreating } =
    useApiCoreLegalEntityCreate({
      mutation: {
        onSuccess: () => {
          toast.success('Legal entity created successfully.')
          queryClient.invalidateQueries({
            queryKey: getApiCoreLegalEntityListQueryKey(),
          })
          onOpenChange(false)
        },
        onError: (error) => {
          toast.error(
            getApiErrorMessage(error, 'Failed to create legal entity.')
          )
        },
      },
    })

  useEffect(() => {
    if (open) {
      reset({ name: '', client_id: defaultClientId ?? '', is_active: 'true' })
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (formData: FormValues) => {
    createLegalEntity({
      data: {
        name: formData.name,
        client: Number(formData.client_id),
        is_active: formData.is_active !== 'false',
      } as any,
    })
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Legal Entity</DrawerTitle>
          <DrawerDescription>
            Enter the details of the new legal entity.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-auto p-4">
          <form
            id="create-legal-entity-form"
            onSubmit={handleSubmit(onSubmit)}
            className="mt-2 space-y-4"
          >
            {!defaultClientId && (
              <FormController
                control={control}
                name="client_id"
                Field={SearchableSelect}
                fieldProps={{
                  label: 'Client',
                  placeholder: 'Select client',
                  options: clientOptions,
                }}
              />
            )}
            <FormController
              control={control}
              name="name"
              Field={Input}
              fieldProps={{
                label: 'Name',
                placeholder: 'e.g. Global Tech US Inc',
              }}
            />
            <FormController
              control={control}
              name="is_active"
              Field={CommonSelect}
              fieldProps={{
                label: 'Status',
                placeholder: 'Select status',
                options: [
                  { value: 'true', label: 'Active' },
                  { value: 'false', label: 'Inactive' },
                ],
              }}
            />
          </form>
        </div>

        <DrawerFooter>
          <Button
            type="submit"
            form="create-legal-entity-form"
            disabled={isCreating}
          >
            {isCreating ? 'Saving...' : 'Save'}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
