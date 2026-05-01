import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import type { MedicalRecord } from '../types'
import { formatDate } from '../utils/format'

type Props = {
  records: MedicalRecord[]
}

export function MedicalRecordsPage({ records }: Props) {
  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, 1fr)' } }}>
      {records.map((record) => (
        <Paper key={record.id} variant="outlined" sx={{ p: 2.5, borderColor: '#e1e7ef' }}>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6">{record.petName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tutor: {record.tutorName}
                </Typography>
              </Box>
              <Chip label={formatDate(record.date)} />
            </Stack>
            <Typography>{record.summary}</Typography>
            <Typography variant="body2" color="text.secondary">
              Prescrição: {record.prescription}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              {record.vaccines.concat(record.exams).map((item) => (
                <Chip key={item} label={item} size="small" variant="outlined" />
              ))}
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Box>
  )
}
