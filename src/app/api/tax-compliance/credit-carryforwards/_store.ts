export interface CreditCarryforward {
  id: number
  legal_entity: string
  state: string
  prior_amount: string
  ending_amount: string
}

let nextId = 4

const records: CreditCarryforward[] = [
  {
    id: 1,
    legal_entity: 'Acme Corp',
    state: 'CA',
    prior_amount: '1250.00',
    ending_amount: '3400.00',
  },
  {
    id: 2,
    legal_entity: 'Acme Corp',
    state: 'NY',
    prior_amount: '-450.00',
    ending_amount: '800.00',
  },
  {
    id: 3,
    legal_entity: 'Globex LLC',
    state: 'TX',
    prior_amount: '0.00',
    ending_amount: '2100.50',
  },
]

export function listCreditRecords(
  search?: string,
  page = 1,
  pageSize = 10
): { count: number; results: CreditCarryforward[] } {
  let filtered = records
  if (search) {
    const lower = search.toLowerCase()
    filtered = records.filter(
      (r) =>
        r.legal_entity.toLowerCase().includes(lower) ||
        r.state.toLowerCase().includes(lower)
    )
  }
  const start = (page - 1) * pageSize
  return {
    count: filtered.length,
    results: filtered.slice(start, start + pageSize),
  }
}

export function createCreditRecord(
  data: Omit<CreditCarryforward, 'id'>
): CreditCarryforward {
  const record: CreditCarryforward = { ...data, id: nextId++ }
  records.push(record)
  return record
}

export function updateCreditRecord(
  id: number,
  data: Partial<Omit<CreditCarryforward, 'id'>>
): CreditCarryforward | null {
  const index = records.findIndex((r) => r.id === id)
  if (index === -1) return null
  records[index] = { ...records[index], ...data }
  return records[index]
}

export function deleteCreditRecord(id: number): boolean {
  const index = records.findIndex((r) => r.id === id)
  if (index === -1) return false
  records.splice(index, 1)
  return true
}
