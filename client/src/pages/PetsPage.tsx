import { Avatar, Box, Button, Chip, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { AddRounded, PetsRounded, SearchRounded } from '@mui/icons-material'
import type { Breed, Pet, Tutor } from '../types'
import { getBreedName, getTutorName } from '../utils/format'

type Props = {
  pets: Pet[]
  tutors: Tutor[]
  breeds: Breed[]
  search: string
  onSearch: (value: string) => void
  onNewPet: () => void
}

export function PetsPage({ pets, tutors, breeds, search, onSearch, onNewPet }: Props) {
  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ alignItems: { lg: 'center' }, justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
            Cadastros / Nível paciente
          </Typography>
          <Typography variant="h4">Pets</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, maxWidth: 680 }}>
            Pacientes vinculados a um tutor e a uma raça, com leitura própria para atendimento e histórico clínico.
          </Typography>
        </Box>
        <Button startIcon={<AddRounded />} variant="contained" size="large" onClick={onNewPet}>
          Novo pet
        </Button>
      </Stack>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 220px' } }}>
        <TextField
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Buscar pet, tutor ou raça"
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Paper variant="outlined" sx={{ p: 1.25, borderColor: '#e1e7ef', bgcolor: '#ffffff' }}>
          <Typography variant="caption" color="text.secondary">
            Pets encontrados
          </Typography>
          <Typography variant="h6">{pets.length}</Typography>
        </Paper>
      </Box>

      <Paper variant="outlined" sx={{ borderColor: '#e1e7ef', overflow: 'hidden', boxShadow: '0 16px 40px rgba(23, 32, 42, 0.05)' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Paciente</TableCell>
              <TableCell>Tutor</TableCell>
              <TableCell>Raça</TableCell>
              <TableCell>Alertas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pets.map((pet) => (
              <TableRow key={pet.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Avatar sx={{ width: 36, height: 36, bgcolor: '#eef5f4', color: 'primary.dark' }}>
                      <PetsRounded fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 800 }}>{pet.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {pet.species} - {pet.age} anos - {pet.weight}kg
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{getTutorName(tutors, pet.tutorId)}</TableCell>
                <TableCell>{getBreedName(breeds, pet.breedId)}</TableCell>
                <TableCell>
                  {pet.alerts.length > 0 ? (
                    <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap' }}>
                      {pet.alerts.map((alert) => (
                        <Chip key={alert} label={alert} size="small" color="warning" variant="outlined" />
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Sem alertas
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  )
}
