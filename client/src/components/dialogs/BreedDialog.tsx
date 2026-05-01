import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'

type Props = {
  open: boolean
  value: { name: string; species: string; notes: string }
  onChange: (value: { name: string; species: string; notes: string }) => void
  onClose: () => void
  onSave: () => void
}

export function BreedDialog({ open, value, onChange, onClose, onSave }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Nova raça</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField label="Nome da raça" value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} />
          <FormControl>
            <InputLabel>Espécie</InputLabel>
            <Select value={value.species} label="Espécie" onChange={(event) => onChange({ ...value, species: event.target.value })}>
              <MenuItem value="Canino">Canino</MenuItem>
              <MenuItem value="Felino">Felino</MenuItem>
              <MenuItem value="Ave">Ave</MenuItem>
              <MenuItem value="Exótico">Exótico</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Observações" value={value.notes} onChange={(event) => onChange({ ...value, notes: event.target.value })} multiline minRows={3} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onSave} disabled={!value.name || !value.species}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
