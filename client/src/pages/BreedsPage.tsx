import { Box, Button, Chip, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { AddRounded, SearchRounded } from '@mui/icons-material'
import type { Breed, Pet } from '../types'

type Props = {
  breeds: Breed[]
  pets: Pet[]
  search: string
  onSearch: (value: string) => void
  onNewBreed: () => void
}

export function BreedsPage({ breeds, pets, search, onSearch, onNewBreed }: Props) {
  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ alignItems: { lg: 'center' }, justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
            Cadastros / Taxonomia clínica
          </Typography>
          <Typography variant="h4">Raças</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, maxWidth: 680 }}>
            Base de classificação usada no cadastro de pets, mantida como dado estrutural antes do paciente.
          </Typography>
        </Box>
        <Button startIcon={<AddRounded />} variant="contained" size="large" onClick={onNewBreed}>
          Nova raça
        </Button>
      </Stack>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 220px' } }}>
        <TextField
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Buscar raça, espécie ou observação"
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
            Raças encontradas
          </Typography>
          <Typography variant="h6">{breeds.length}</Typography>
        </Paper>
      </Box>

      <Paper variant="outlined" sx={{ borderColor: '#e1e7ef', overflow: 'hidden', boxShadow: '0 16px 40px rgba(23, 32, 42, 0.05)' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #e1e7ef', bgcolor: '#ffffff' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6">Catálogo de raças</Typography>
              <Typography variant="body2" color="text.secondary">
                Regra de hierarquia: raça pertence a espécie e depois é vinculada ao pet.
              </Typography>
            </Box>
            <Chip label={`${pets.length} pets vinculados`} variant="outlined" />
          </Stack>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Raça</TableCell>
              <TableCell>Espécie</TableCell>
              <TableCell>Pets vinculados</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {breeds.map((breed) => (
              <TableRow key={breed.id} hover>
                <TableCell>
                  <Typography sx={{ fontWeight: 800 }}>{breed.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {breed.notes || 'Sem observações'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={breed.species} size="small" variant="outlined" />
                </TableCell>
                <TableCell>{pets.filter((pet) => pet.breedId === breed.id).length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  )
}
