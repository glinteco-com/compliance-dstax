'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import FormController from '@/components/form/FormController'
import { Trash2 } from 'lucide-react'
import { useApiCoreClientList } from '@/api/generated/core-client/core-client'
import {
  SearchableSelect,
  type SelectOption,
} from '@/components/select/SearchableSelect'
import { Button } from '@/components/ui/button'
import { LegalEntityMultiSelect } from './LegalEntityMultiSelect'
import { type CommunicationFormData } from './schema'

export function RecipientRow({
  index,
  remove,
  isRemovable,
  excludedClientIds,
}: {
  index: number
  remove: (index: number) => void
  isRemovable: boolean
  excludedClientIds: string[]
}) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CommunicationFormData>()

  const clientId = useWatch({
    control,
    name: `recipients.${index}.clientId`,
  })

  const [clientSearch, setClientSearch] = useState('')
  const [clientPage, setClientPage] = useState(1)
  const [clientOptions, setClientOptions] = useState<SelectOption[]>([])
  const [prevClientData, setPrevClientData] = useState<any>(null)

  const { data: clientData, isFetching: clientLoading } = useApiCoreClientList({
    name__icontains: clientSearch || undefined,
    page: clientPage,
    page_size: 20,
  })

  // Adjust state during render to avoid cascading renders from useEffect
  if (clientData !== prevClientData) {
    setPrevClientData(clientData)
    if (clientData?.results) {
      const newOptions: SelectOption[] = clientData.results.map((client) => ({
        value: client.id.toString(),
        label: client.name,
      }))
      setClientOptions((prev) =>
        clientPage === 1 ? newOptions : [...prev, ...newOptions]
      )
    }
  }

  const prevClientIdRef = useRef(clientId)
  useEffect(() => {
    if (prevClientIdRef.current !== clientId) {
      // Small optimization: only reset if not already empty
      setValue(`recipients.${index}.legalEntityIds`, [])
      prevClientIdRef.current = clientId
    }
  }, [clientId, index, setValue])

  const handleClientSearch = useCallback((query: string) => {
    setClientSearch(query)
    setClientPage(1)
  }, [])

  const handleLoadMoreClients = useCallback(() => {
    if (clientData?.next && !clientLoading) {
      setClientPage((prev) => prev + 1)
    }
  }, [clientData?.next, clientLoading])

  const filteredClientOptions = clientOptions.filter(
    (option) => !excludedClientIds.includes(option.value.toString())
  )

  return (
    <div className="flex items-start gap-3">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
        <FormController
          control={control}
          name={`recipients.${index}.clientId`}
          Field={SearchableSelect}
          fieldProps={{
            placeholder: 'SELECT CLIENT',
            options: filteredClientOptions,
            onSearch: handleClientSearch,
            onLoadMore: handleLoadMoreClients,
            hasMore: !!clientData?.next,
            loading: clientLoading,
          }}
        />

        <FormController
          control={control}
          name={`recipients.${index}.legalEntityIds`}
          Field={LegalEntityMultiSelect}
          fieldProps={{
            clientId: clientId ?? '',
          }}
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={!isRemovable}
        onClick={() => remove(index)}
        className="hover:text-destructive mt-0.5 shrink-0 text-zinc-400"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  )
}
