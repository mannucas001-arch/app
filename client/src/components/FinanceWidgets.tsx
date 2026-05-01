import { Paper, Stack, Typography } from '@mui/material'
import { formatCurrency } from '../utils/format'

type MoneyCardProps = {
  title: string
  value: number
  tone: string
}

export function MoneyCard({ title, value, tone }: MoneyCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderColor: '#e1e7ef' }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, color: tone }}>
        {formatCurrency(value)}
      </Typography>
    </Paper>
  )
}

type MoneyLineProps = {
  label: string
  value: number
  color: string
}

export function MoneyLine({ label, value, color }: MoneyLineProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
      <Typography color="text.secondary">{label}</Typography>
      <Typography sx={{ color, fontWeight: 800 }}>{formatCurrency(value)}</Typography>
    </Stack>
  )
}
