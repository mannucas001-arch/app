import { Chip } from '@mui/material'
import type { AppointmentStatus, FinancialStatus, StockStatus } from '../types'

type Props = {
  status: AppointmentStatus | FinancialStatus | StockStatus
}

const statusMap = {
  confirmado: { label: 'Confirmado', color: 'success' },
  aguardando: { label: 'Aguardando', color: 'warning' },
  em_atendimento: { label: 'Em atendimento', color: 'secondary' },
  pago: { label: 'Pago', color: 'success' },
  pendente: { label: 'Pendente', color: 'warning' },
  vencido: { label: 'Vencido', color: 'error' },
  ok: { label: 'Ok', color: 'success' },
  baixo: { label: 'Baixo', color: 'warning' },
  critico: { label: 'Crítico', color: 'error' },
} as const

export function StatusChip({ status }: Props) {
  const mapped = statusMap[status]

  return <Chip label={mapped.label} color={mapped.color} size="small" variant="outlined" />
}
