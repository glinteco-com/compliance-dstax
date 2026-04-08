import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { useClients } from '../legal-entities/hooks/useClients'
import { Client } from '@/models/client'

type ClientWithId = Client & { id: number }

export function useClientsPage() {
  const [searchInput, setSearchInput] = useState('')
  const search = useDebounce(searchInput, 400)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    setCurrentPage(1)
  }

  const { data, isLoading } = useClients({
    page: currentPage,
    pageSize,
    search: search || undefined,
  })

  const clients = (data?.results ?? []) as ClientWithId[]
  const totalPages = Math.ceil((data?.count ?? 0) / pageSize)

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  return {
    searchInput,
    handleSearchChange,
    clients,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    handlePageSizeChange,
    pageSize,
    totalItems: data?.count ?? 0,
  }
}
