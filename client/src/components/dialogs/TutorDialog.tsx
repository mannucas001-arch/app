import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material'

type Props = {
  open: boolean
  value: { name: string; phone: string; email: string; address: string }
  onChange: (value: { name: string; phone: string; email: string; address: string }) => void
  onClose: () => void
  onSave: () => void
}

export function TutorDialog({ open, value, onChange, onClose, onSave }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Novo tutor</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField label="Nome" value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} />
          <TextField label="Telefone" value={value.phone} onChange={(event) => onChange({ ...value, phone: event.target.value })} />
          <TextField label="E-mail" value={value.email} onChange={(event) => onChange({ ...value, email: event.target.value })} />
          <TextField label="Endereço" value={value.address} onChange={(event) => onChange({ ...value, address: event.target.value })} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onSave} disabled={!value.name || !value.phone}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
