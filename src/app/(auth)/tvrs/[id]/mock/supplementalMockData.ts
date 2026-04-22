import { EfileRecord } from '../../efile/hooks/useEfileRecords'
import { CreditCarryforward } from '../../credit-carryforwards/hooks/useCreditCarryforwards'

export const MOCK_EFILE_RECORDS: EfileRecord[] = [
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

export const MOCK_CREDIT_RECORDS: CreditCarryforward[] = [
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
