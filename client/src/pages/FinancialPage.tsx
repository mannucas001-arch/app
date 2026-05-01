import { Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import type { FinancialEntry } from '../types'
import { MoneyCard } from '../components/FinanceWidgets'
import { StatusChip } from '../components/StatusChip'

type Props = {
  entries: FinancialEntry[]
  cashIn: number
  cashOut: number
}

export function FinancialPage({ entries, cashIn, cashOut }: Props) {
  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
        <MoneyCard title="Receitas" value={cashIn} tone="success.main" />
        <MoneyCard title="Despesas" value={cashOut} tone="error.main" />
        <MoneyCard title="Saldo" value={cashIn - cashOut} tone="primary.main" />
      </Stack>

      <Paper variant="outlined" sx={{ borderColor: '#e1e7ef', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descrição</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Vencimento</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Valor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id} hover>
                <TableCell>{entry.description}</TableCell>
                <TableCell>{entry.category}</TableCell>
                <TableCell>{entry.dueDate}</TableCell>
                <TableCell>
                  <StatusChip status={entry.status} />
                </TableCell>
                <TableCell align="right">{entry.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  )
}
