'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CreditCarryforward } from '../../credit-carryforwards/hooks/useCreditCarryforwards'

interface CreditPanelProps {
  rows: CreditCarryforward[]
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    n
  )

export function CreditPanel({ rows }: CreditPanelProps) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Credit Carryforwards
      </h3>
      <div className="rounded-md border bg-white dark:bg-zinc-950">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-9 text-xs font-semibold">
                Legal Entity
              </TableHead>
              <TableHead className="h-9 text-xs font-semibold">State</TableHead>
              <TableHead className="h-9 text-right text-xs font-semibold">
                Prior ($)
              </TableHead>
              <TableHead className="h-9 text-right text-xs font-semibold">
                Ending ($)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-4 text-center text-xs text-zinc-400"
                >
                  No credit carryforward records
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const priorNum = parseFloat(row.prior_amount)
                const endingNum = parseFloat(row.ending_amount)
                return (
                  <TableRow key={row.id} className="h-10">
                    <TableCell className="text-xs font-bold">
                      {row.legal_entity}
                    </TableCell>
                    <TableCell className="text-xs">{row.state}</TableCell>
                    <TableCell
                      className={`text-right font-mono text-xs ${priorNum < 0 ? 'text-red-600 dark:text-red-400' : ''}`}
                    >
                      {fmt(priorNum)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono text-xs ${endingNum < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}
                    >
                      {fmt(endingNum)}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
