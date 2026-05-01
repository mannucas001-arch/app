import { Box, Button, Checkbox, FormControlLabel, Paper, Stack, TextField, Typography } from '@mui/material'
import { HealthAndSafetyRounded, LockRounded } from '@mui/icons-material'

type Props = {
  email: string
  password: string
  remember: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onRememberChange: (checked: boolean) => void
  onLogin: () => void
}

export function LoginPage({ email, password, remember, onEmailChange, onPasswordChange, onRememberChange, onLogin }: Props) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Paper variant="outlined" sx={{ width: '100%', maxWidth: 540, p: 4, borderColor: '#e1e7ef' }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
              Bem-vindo ao VetPrime
            </Typography>
            <Typography variant="h4">Acesse sua conta</Typography>
            <Typography color="text.secondary">
              Digite seu e-mail e senha para acessar o painel de clínica.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'primary.main', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <HealthAndSafetyRounded />
            </Box>
            <Typography>Faça login para gerenciar estoque, agendamento e pacientes.</Typography>
          </Stack>

          <TextField label="E-mail" value={email} onChange={(event) => onEmailChange(event.target.value)} fullWidth />
          <TextField
            type="password"
            label="Senha"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            fullWidth
          />
          <FormControlLabel
            control={<Checkbox checked={remember} onChange={(event) => onRememberChange(event.target.checked)} />}
            label="Lembrar-me"
          />
          <Button variant="contained" size="large" onClick={onLogin} startIcon={<LockRounded />}>
            Entrar
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
