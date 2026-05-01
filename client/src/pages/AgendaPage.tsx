import { Button, Stack } from '@mui/material'
import { AddRounded } from '@mui/icons-material'
import type { Appointment } from '../types'
import { ScheduleTable } from '../components/ScheduleTable'

type Props = {
  appointments: Appointment[]
  onNewAppointment: () => void
}

export function AgendaPage({ appointments, onNewAppointment }: Props) {
  return (
    <Stack spacing={2.5}>
      <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
        <Button startIcon={<AddRounded />} variant="contained" onClick={onNewAppointment}>
          Novo agendamento
        </Button>
      </Stack>
      <ScheduleTable appointments={appointments} />
    </Stack>
  )
}
