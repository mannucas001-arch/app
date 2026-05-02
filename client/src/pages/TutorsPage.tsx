import { Avatar, Box, Button, Chip, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material'
import { AddRounded, SearchRounded } from '@mui/icons-material'
import type { Pet, Tutor } from '../types'
import { initials } from '../utils/format'

type Props = {
  tutors: Tutor[]
  pets: Pet[]
  search: string
  onSearch: (value: string) => void
  onNewTutor: () => void
}

export function TutorsPage({ tutors, pets, search, onSearch, onNewTutor }: Props) {
  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ alignItems: { lg: 'center' }, justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
            Cadastros / Nível mestre
          </Typography>
          <Typography variant="h4">Tutores</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, maxWidth: 680 }}>
            Responsáveis financeiros e contatos principais da clínica, separados dos pacientes.
          </Typography>
        </Box>
        <Button startIcon={<AddRounded />} variant="contained" size="large" onClick={onNewTutor}>
          Novo tutor
        </Button>
      </Stack>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 220px' } }}>
        <TextField
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Buscar tutor, telefone ou e-mail"
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
            Tutores encontrados
          </Typography>
          <Typography variant="h6">{tutors.length}</Typography>
        </Paper>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
        {tutors.map((tutor) => (
          <Paper
            key={tutor.id}
            variant="outlined"
            sx={{
              p: 2.5,
              borderColor: '#e1e7ef',
              boxShadow: '0 16px 40px rgba(23, 32, 42, 0.05)',
            }}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
              <Avatar sx={{ bgcolor: '#17202a', color: '#ffffff' }}>{initials(tutor.name)}</Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6">{tutor.name}</Typography>
                  <Chip label={`${pets.filter((pet) => pet.tutorId === tutor.id).length} pets`} size="small" sx={{ bgcolor: '#eef5f4', color: 'primary.dark', fontWeight: 700 }} />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {tutor.phone} - {tutor.email}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {tutor.address}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>
    </Stack>
  )
}
