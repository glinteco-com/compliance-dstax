export interface EfileRecord {
  id: number
  legal_entity: string
  state_jurisdiction: string
  account_number: string
  user: string
}

let nextId = 4

const records: EfileRecord[] = [
  {
    id: 1,
    legal_entity: 'Acme Corp',
    state_jurisdiction: 'CA',
    account_number: '4400-123456',
    user: 'admin@acme.com',
  },
  {
    id: 2,
    legal_entity: 'Acme Corp',
    state_jurisdiction: 'NY',
    account_number: '5500-789012',
    user: 'admin@acme.com',
  },
  {
    id: 3,
    legal_entity: 'Globex LLC',
    state_jurisdiction: 'TX',
    account_number: '6600-345678',
    user: 'tax@globex.com',
  },
]

export function listEfileRecords(
  search?: string,
  page = 1,
  pageSize = 10
): { count: number; results: EfileRecord[] } {
  let filtered = records
  if (search) {
    const lower = search.toLowerCase()
    filtered = records.filter(
      (r) =>
        r.legal_entity.toLowerCase().includes(lower) ||
        r.state_jurisdiction.toLowerCase().includes(lower) ||
        r.account_number.toLowerCase().includes(lower) ||
        r.user.toLowerCase().includes(lower)
    )
  }
  const start = (page - 1) * pageSize
  return {
    count: filtered.length,
    results: filtered.slice(start, start + pageSize),
  }
}

export function createEfileRecord(data: Omit<EfileRecord, 'id'>): EfileRecord {
  const record: EfileRecord = { ...data, id: nextId++ }
  records.push(record)
  return record
}

export function updateEfileRecord(
  id: number,
  data: Partial<Omit<EfileRecord, 'id'>>
): EfileRecord | null {
  const index = records.findIndex((r) => r.id === id)
  if (index === -1) return null
  records[index] = { ...records[index], ...data }
  return records[index]
}

export function deleteEfileRecord(id: number): boolean {
  const index = records.findIndex((r) => r.id === id)
  if (index === -1) return false
  records.splice(index, 1)
  return true
}
