import { useApiCoreClientRetrieve } from '@/api/generated/core-client/core-client'

export function useClientDetail(clientId: number) {
  const { data: client, isLoading } = useApiCoreClientRetrieve(clientId, {
    query: { enabled: !!clientId },
  })

  const clientData = client as unknown as
    | { id: number; name: string }
    | undefined

  return {
    clientData,
    isLoading,
  }
}
