import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import type { Breed, Tutor } from '../../types'

type Props = {
  open: boolean
  value: {
    name: string
    species: string
    tutorId: string
    breedId: string
    age: number
    weight: number
    alerts: string
  }
  tutors: Tutor[]
  breeds: Breed[]
  onChange: (value: {
    name: string
    species: string
    tutorId: string
    breedId: string
    age: number
    weight: number
    alerts: string
  }) => void
  onClose: () => void
  onSave: () => void
}

export function PetDialog({ open, value, tutors, breeds, onChange, onClose, onSave }: Props) {
  const filteredBreeds = breeds.filter((breed) => breed.species === value.species)

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Novo pet</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField label="Nome do pet" value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} />
          <FormControl>
            <InputLabel>Espécie</InputLabel>
            <Select
              value={value.species}
              label="Espécie"
              onChange={(event) => onChange({ ...value, species: event.target.value, breedId: '' })}
            >
              <MenuItem value="Canino">Canino</MenuItem>
              <MenuItem value="Felino">Felino</MenuItem>
              <MenuItem value="Ave">Ave</MenuItem>
              <MenuItem value="Exótico">Exótico</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Tutor</InputLabel>
            <Select value={value.tutorId} label="Tutor" onChange={(event) => onChange({ ...value, tutorId: event.target.value })}>
              {tutors.map((tutor) => (
                <MenuItem key={tutor.id} value={tutor.id}>
                  {tutor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Raça</InputLabel>
            <Select value={value.breedId} label="Raça" onChange={(event) => onChange({ ...value, breedId: event.target.value })}>
              {filteredBreeds.map((breed) => (
                <MenuItem key={breed.id} value={breed.id}>
                  {breed.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="Idade" type="number" value={value.age} onChange={(event) => onChange({ ...value, age: Number(event.target.value) })} fullWidth />
            <TextField label="Peso" type="number" value={value.weight} onChange={(event) => onChange({ ...value, weight: Number(event.target.value) })} fullWidth />
          </Stack>
          <TextField
            label="Alertas separados por vírgula"
            value={value.alerts}
            onChange={(event) => onChange({ ...value, alerts: event.target.value })}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onSave} disabled={!value.name || !value.tutorId || !value.breedId}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
