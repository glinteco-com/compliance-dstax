'use client'

import { EfileRecord } from '../../efile/hooks/useEfileRecords'
import { CreditCarryforward } from '../../credit-carryforwards/hooks/useCreditCarryforwards'
import {
  MOCK_EFILE_RECORDS,
  MOCK_CREDIT_RECORDS,
} from '../mock/supplementalMockData'
import { EfilePanel } from './EfilePanel'
import { CreditPanel } from './CreditPanel'

interface TVRSupplementalPanelProps {
  efileRows: EfileRecord[]
  creditRows: CreditCarryforward[]
}

export function TVRSupplementalPanel({
  efileRows,
  creditRows,
}: TVRSupplementalPanelProps) {
  const displayedEfileRows =
    efileRows.length > 0 ? efileRows : MOCK_EFILE_RECORDS
  const displayedCreditRows =
    creditRows.length > 0 ? creditRows : MOCK_CREDIT_RECORDS

  return (
    <div className="flex h-full flex-col gap-6 overflow-auto p-4">
      <EfilePanel rows={displayedEfileRows} />
      <CreditPanel rows={displayedCreditRows} />
    </div>
  )
}
