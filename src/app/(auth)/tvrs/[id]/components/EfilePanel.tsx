'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EfileRecord } from '../../efile/hooks/useEfileRecords'

interface EfilePanelProps {
  rows: EfileRecord[]
}

export function EfilePanel({ rows }: EfilePanelProps) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        EFILE Information
      </h3>
      <div className="rounded-md border bg-white dark:bg-zinc-950">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-9 text-xs font-semibold">
                Legal Entity
              </TableHead>
              <TableHead className="h-9 text-xs font-semibold">
                State/Jur.
              </TableHead>
              <TableHead className="h-9 text-xs font-semibold">
                Acct #
              </TableHead>
              <TableHead className="h-9 text-xs font-semibold">User</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-4 text-center text-xs text-zinc-400"
                >
                  No EFILE records
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} className="h-10">
                  <TableCell className="text-xs font-bold">
                    {row.legal_entity}
                  </TableCell>
                  <TableCell className="text-xs">
                    {row.state_jurisdiction}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.account_number}
                  </TableCell>
                  <TableCell className="text-xs">{row.user}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
