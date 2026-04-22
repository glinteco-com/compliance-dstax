'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { CommonTable } from '@/components/table/CommonTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Search } from 'lucide-react'
import useDialog from '@/hooks/useDialog'
import { ConfirmDialog } from '@/components/dialog/ConfirmDialog'
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
import { useColumnCreditCarryforward } from './hooks/useColumnCreditCarryforward'
import {
  useCreditCarryforwards,
  useCreditCarryforwardCreate,
  useCreditCarryforwardUpdate,
  useCreditCarryforwardDelete,
  CreditCarryforward,
} from './hooks/useCreditCarryforwards'
import { useDebounce } from '@/hooks/useDebounce'
import { getApiErrorMessage } from '@/lib/utils'

const formSchema = z.object({
  legal_entity: z.string().min(1, 'Legal entity is required'),
  state: z.string().min(1, 'State is required'),
  prior_amount: z
    .string()
    .min(1, 'Prior amount is required')
    .refine((v) => !isNaN(parseFloat(v)), { message: 'Must be a number' }),
  ending_amount: z
    .string()
    .min(1, 'Ending amount is required')
    .refine((v) => !isNaN(parseFloat(v)), { message: 'Must be a number' }),
})

type FormValues = z.infer<typeof formSchema>

const formatCurrency = (value: string) => {
  const num = parseFloat(value)
  if (isNaN(num)) return value
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num)
}

export default function CreditCarryforwardsPage() {
  const [targetId, setTargetId] = React.useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [drawerMode, setDrawerMode] = React.useState<
    'create' | 'edit' | 'view'
  >('create')
  const [selectedItem, setSelectedItem] =
    React.useState<CreditCarryforward | null>(null)

  const {
    isOpenDialog: isOpenDeleteDialog,
    onOpenDialog: onOpenDeleteDialog,
    onCloseDialog: onCloseDeleteDialog,
    setIsOpenDialog: setIsOpenDeleteDialog,
  } = useDialog()

  const [searchInput, setSearchInput] = React.useState('')
  const search = useDebounce(searchInput, 400)

  const [stateFilter, setStateFilter] = React.useState('')
  const [clientFilter, setClientFilter] = React.useState('')

  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [search, stateFilter, clientFilter])

  const { data, isLoading } = useCreditCarryforwards({
    page: currentPage,
    page_size: pageSize,
    search: search || undefined,
    state: stateFilter || undefined,
    legal_entity: clientFilter || undefined,
  })

  // Derive unique option lists from the current page's results
  const stateOptions = React.useMemo(() => {
    const set = new Set((data?.results ?? []).map((r) => r.state))
    return Array.from(set).sort()
  }, [data])

  const clientOptions = React.useMemo(() => {
    const set = new Set((data?.results ?? []).map((r) => r.legal_entity))
    return Array.from(set).sort()
  }, [data])

  const paginatedData = data?.results ?? []
  const totalPages = Math.ceil((data?.count ?? 0) / pageSize)

  const { mutate: createRecord, isPending: isCreating } =
    useCreditCarryforwardCreate()
  const { mutate: updateRecord, isPending: isUpdating } =
    useCreditCarryforwardUpdate()
  const { mutate: deleteRecord, isPending: isDeleting } =
    useCreditCarryforwardDelete()

  const { control, reset, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      legal_entity: '',
      state: '',
      prior_amount: '',
      ending_amount: '',
    },
  })

  const openDrawer = (
    mode: 'create' | 'edit' | 'view',
    item: CreditCarryforward | null = null
  ) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setDrawerMode(mode)
    setSelectedItem(item)

    if (mode === 'edit' && item) {
      reset({
        legal_entity: item.legal_entity,
        state: item.state,
        prior_amount: item.prior_amount,
        ending_amount: item.ending_amount,
      })
    } else if (mode === 'create') {
      reset({
        legal_entity: '',
        state: '',
        prior_amount: '',
        ending_amount: '',
      })
    }

    setIsDrawerOpen(true)
  }

  const onSubmit = (formData: FormValues) => {
    if (drawerMode === 'create') {
      createRecord(formData, {
        onSuccess: () => {
          toast.success('Credit carryforward created.')
          setIsDrawerOpen(false)
        },
        onError: (error) => {
          toast.error(
            getApiErrorMessage(error, 'Failed to create credit carryforward.')
          )
        },
      })
    } else if (drawerMode === 'edit' && selectedItem) {
      updateRecord(
        { id: selectedItem.id, payload: formData },
        {
          onSuccess: () => {
            toast.success('Credit carryforward updated.')
            setIsDrawerOpen(false)
          },
          onError: (error) => {
            toast.error(
              getApiErrorMessage(error, 'Failed to update credit carryforward.')
            )
          },
        }
      )
    }
  }

  const handleDelete = (id: number) => {
    setTargetId(id)
    onOpenDeleteDialog()
  }

  const handleConfirmDelete = () => {
    if (!targetId) return
    deleteRecord(targetId, {
      onSuccess: () => {
        toast.success('Credit carryforward deleted.')
        onCloseDeleteDialog()
      },
      onError: (error) => {
        toast.error(
          getApiErrorMessage(error, 'Failed to delete credit carryforward.')
        )
      },
    })
  }

  const { columns } = useColumnCreditCarryforward({
    onView: (item) => openDrawer('view', item),
    onEdit: (item) => openDrawer('edit', item),
    onDelete: handleDelete,
  })

  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Credit Carryforwards
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage credit carryforward amounts by legal entity and state.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* State filter */}
          <Select
            value={stateFilter}
            onValueChange={(val) =>
              setStateFilter(val === '__all__' ? '' : val)
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="State/Jurisdiction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All States</SelectItem>
              {stateOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Client (Legal Entity) filter */}
          <Select
            value={clientFilter}
            onValueChange={(val) =>
              setClientFilter(val === '__all__' ? '' : val)
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Clients</SelectItem>
              {clientOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Input
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-56"
              prefixIcon={<Search />}
            />
          </div>
          <Button
            className="bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
            onClick={() => openDrawer('create')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Credit
          </Button>
        </div>
      </div>

      <CommonTable
        columns={columns}
        data={paginatedData}
        emptyMessage="No credit carryforwards found"
        isLoading={isLoading}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          onPageSizeChange: (newSize) => {
            setPageSize(newSize)
            setCurrentPage(1)
          },
          pageSize,
          totalItems: data?.count ?? 0,
        }}
      />

      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        direction="right"
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {drawerMode === 'create' && 'Add Credit Carryforward'}
              {drawerMode === 'edit' && 'Edit Credit Carryforward'}
              {drawerMode === 'view' && 'Credit Carryforward Details'}
            </DrawerTitle>
            <DrawerDescription>
              {drawerMode === 'create' && 'Enter credit carryforward details.'}
              {drawerMode === 'edit' &&
                'Update the selected credit carryforward.'}
              {drawerMode === 'view' &&
                'Details of the selected credit carryforward.'}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-auto p-4">
            {drawerMode === 'view' && selectedItem && (
              <div className="space-y-4 text-sm">
                {[
                  ['Legal Entity', selectedItem.legal_entity],
                  ['State', selectedItem.state],
                  ['Prior Amount', formatCurrency(selectedItem.prior_amount)],
                  ['Ending Amount', formatCurrency(selectedItem.ending_amount)],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-1">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {label}
                    </span>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <form
                id="credit-form"
                onSubmit={handleSubmit(onSubmit)}
                className="mt-2 space-y-4"
              >
                <FormController
                  control={control}
                  name="legal_entity"
                  Field={Input}
                  fieldProps={{
                    label: 'Legal Entity',
                    placeholder: 'e.g. Acme Corp',
                  }}
                />
                <FormController
                  control={control}
                  name="state"
                  Field={Input}
                  fieldProps={{
                    label: 'State',
                    placeholder: 'e.g. CA, NY',
                  }}
                />
                <FormController
                  control={control}
                  name="prior_amount"
                  Field={Input}
                  fieldProps={{
                    label: 'Prior Amount ($)',
                    placeholder: 'e.g. 1500.00',
                    type: 'number',
                    step: '0.01',
                  }}
                />
                <FormController
                  control={control}
                  name="ending_amount"
                  Field={Input}
                  fieldProps={{
                    label: 'Ending Amount ($)',
                    placeholder: 'e.g. 2500.00',
                    type: 'number',
                    step: '0.01',
                  }}
                />
              </form>
            )}
          </div>

          <DrawerFooter>
            {(drawerMode === 'create' || drawerMode === 'edit') && (
              <Button
                type="submit"
                form="credit-form"
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? 'Saving...' : 'Save'}
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <ConfirmDialog
        isOpen={isOpenDeleteDialog}
        onOpenChange={setIsOpenDeleteDialog}
        variant="delete"
        title="Delete Credit Carryforward"
        description="Are you sure you want to delete this credit carryforward? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  )
}
