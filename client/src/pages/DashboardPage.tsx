import { Box, Button, Chip, Divider, Paper, Stack, Typography } from '@mui/material'
import { AddRounded } from '@mui/icons-material'
import type { BootstrapPayload } from '../types'
import { MoneyCard, MoneyLine } from '../components/FinanceWidgets'
import { ScheduleTable } from '../components/ScheduleTable'

type Props = {
  data: BootstrapPayload
  cashIn: number
  cashOut: number
  onNewAppointment: () => void
}

export function DashboardPage({ data, cashIn, cashOut, onNewAppointment }: Props) {
  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ alignItems: { lg: 'center' }, justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
            Dashboard
          </Typography>
          <Typography variant="h4">Visão geral da clínica</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, maxWidth: 680 }}>
            Controle rápido de receita, pacientes e próximos atendimentos.
          </Typography>
        </Box>
        <Button startIcon={<AddRounded />} variant="contained" size="large" onClick={onNewAppointment}>
          Novo agendamento
        </Button>
      </Stack>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
        <MoneyCard title="Receitas" value={cashIn} tone="success.main" />
        <MoneyCard title="Despesas" value={cashOut} tone="error.main" />
        <MoneyCard title="Saldo" value={cashIn - cashOut} tone="primary.main" />
      </Box>

      <Paper variant="outlined" sx={{ borderColor: '#e1e7ef', overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #e1e7ef', bgcolor: '#ffffff' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6">Últimos agendamentos</Typography>
              <Typography variant="body2" color="text.secondary">
                Agenda rápida para o dia.
              </Typography>
            </Box>
            <Chip label={`${data.appointments.length} agendamentos`} variant="outlined" />
          </Stack>
        </Box>
        <ScheduleTable appointments={data.appointments} />
      </Paper>

      <Paper variant="outlined" sx={{ p: 2.5, borderColor: '#e1e7ef' }}>
        <Typography variant="h6">Resumo financeiro</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={1.5}>
          <MoneyLine label="Receitas" value={cashIn} color="success.main" />
          <MoneyLine label="Despesas" value={cashOut} color="error.main" />
          <MoneyLine label="Saldo" value={cashIn - cashOut} color="primary.main" />
        </Stack>
      </Paper>
    </Stack>
  )
}
