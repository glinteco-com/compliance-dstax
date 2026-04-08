import { useState, useMemo } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { useLegalEntities } from '../../clients/legal-entities/hooks/useLegalEntities'
import { useClients } from '../../clients/legal-entities/hooks/useClients'
import { LegalEntity } from '@/models/legalEntity'
import { Client } from '@/models/client'

type LegalEntityWithId = LegalEntity & { id: number }
type ClientWithId = Client & { id: number }

export function useLegalEntitiesPage() {
  const [searchInput, setSearchInput] = useState('')
  const search = useDebounce(searchInput, 400)
  const [selectedClientId, setSelectedClientId] = useState<string>('ALL')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    setCurrentPage(1)
  }

  const handleClientChange = (value: string) => {
    setSelectedClientId(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    setCurrentPage(1)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  const { data: clientsData } = useClients({ page: 1, pageSize: 200 })
  const clients = useMemo(
    () => (clientsData?.results ?? []) as ClientWithId[],
    [clientsData?.results]
  )

  const isActiveFilter =
    selectedStatus === 'active'
      ? true
      : selectedStatus === 'inactive'
        ? false
        : undefined

  const { data, isLoading } = useLegalEntities({
    page: currentPage,
    pageSize,
    search: search || undefined,
    clientId: selectedClientId !== 'ALL' ? Number(selectedClientId) : undefined,
    isActive: isActiveFilter,
  })

  const entities = (data?.results ?? []) as LegalEntityWithId[]
  const totalPages = Math.ceil((data?.count ?? 0) / pageSize)

  const clientMap = useMemo(() => {
    const map: Record<number, string> = {}
    clients.forEach((c) => {
      map[c.id] = c.name
    })
    return map
  }, [clients])

  return {
    searchInput,
    handleSearchChange,
    selectedClientId,
    handleClientChange,
    selectedStatus,
    handleStatusChange,
    clients,
    clientMap,
    entities,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    handlePageSizeChange,
    pageSize,
    totalItems: data?.count ?? 0,
  }
}
