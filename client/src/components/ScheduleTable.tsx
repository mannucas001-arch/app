import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import type { Appointment } from '../types'
import { StatusChip } from './StatusChip'
import { formatDate } from '../utils/format'

type Props = {
  appointments: Appointment[]
}

export function ScheduleTable({ appointments }: Props) {
  return (
    <Paper variant="outlined" sx={{ borderColor: '#e1e7ef', overflow: 'hidden' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Horário</TableCell>
            <TableCell>Paciente</TableCell>
            <TableCell>Tutor</TableCell>
            <TableCell>Profissional</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id} hover>
              <TableCell>
                <Typography sx={{ fontWeight: 800 }}>{appointment.time}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(appointment.date)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 700 }}>{appointment.petName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {appointment.reason}
                </Typography>
              </TableCell>
              <TableCell>{appointment.tutorName}</TableCell>
              <TableCell>{appointment.veterinarian}</TableCell>
              <TableCell>
                <StatusChip status={appointment.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}
