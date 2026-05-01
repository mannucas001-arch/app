import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import type { AppointmentStatus, Tutor } from '../../types'

type AppointmentDialogValue = {
  date: string
  time: string
  tutorName: string
  petName: string
  veterinarian: string
  reason: string
  status: AppointmentStatus
}

type Props = {
  open: boolean
  value: AppointmentDialogValue
  tutors: Tutor[]
  onChange: (value: AppointmentDialogValue) => void
  onStatusChange: (event: SelectChangeEvent) => void
  onClose: () => void
  onSave: () => void
}

export function AppointmentDialog({ open, value, tutors, onChange, onStatusChange, onClose, onSave }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Novo agendamento</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              type="date"
              label="Data"
              value={value.date}
              onChange={(event) => onChange({ ...value, date: event.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            <TextField
              type="time"
              label="Horário"
              value={value.time}
              onChange={(event) => onChange({ ...value, time: event.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
          </Stack>
          <TextField label="Tutor" value={value.tutorName} onChange={(event) => onChange({ ...value, tutorName: event.target.value })} />
          <TextField label="Paciente" value={value.petName} onChange={(event) => onChange({ ...value, petName: event.target.value })} />
          <TextField
            label="Veterinário"
            value={value.veterinarian}
            onChange={(event) => onChange({ ...value, veterinarian: event.target.value })}
          />
          <TextField label="Motivo" value={value.reason} onChange={(event) => onChange({ ...value, reason: event.target.value })} />
          <FormControl>
            <InputLabel>Status</InputLabel>
            <Select value={value.status} label="Status" onChange={onStatusChange}>
              <MenuItem value="aguardando">Aguardando</MenuItem>
              <MenuItem value="confirmado">Confirmado</MenuItem>
              <MenuItem value="em_atendimento">Em atendimento</MenuItem>
            </Select>
          </FormControl>
          {tutors.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              {tutors.length} tutores cadastrados
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onSave} disabled={!value.tutorName || !value.petName || !value.reason}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
