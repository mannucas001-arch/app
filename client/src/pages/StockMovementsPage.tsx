import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { AddRounded } from '@mui/icons-material'
import type { Product, StockMovement } from '../types'

type Props = {
  products: Product[]
  movements: StockMovement[]
  onNewStockMovement: () => void
}

export function StockMovementsPage({ products, movements, onNewStockMovement }: Props) {
  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
            Estoque / Historico
          </Typography>
          <Typography variant="h4">Movimentações de estoque</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, maxWidth: 720 }}>
            Livro de movimentos que explica cada alteracao no saldo dos produtos.
          </Typography>
        </Box>
        <Button startIcon={<AddRounded />} variant="contained" size="large" onClick={onNewStockMovement}>
          Nova movimentacao
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ borderColor: '#e1e7ef', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Produto</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Origem</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell align="right">Qtd.</TableCell>
                <TableCell align="right">Saldo anterior</TableCell>
                <TableCell align="right">Saldo posterior</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 800 }}>{getProductName(products, movement.produtoId)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(movement.createdAt).toLocaleString('pt-BR')}
                    </Typography>
                  </TableCell>
                  <TableCell>{movement.tipoMovimentacao}</TableCell>
                  <TableCell>{movement.origem}</TableCell>
                  <TableCell>{movement.documentoReferencia || '-'}</TableCell>
                  <TableCell align="right">{movement.quantidade}</TableCell>
                  <TableCell align="right">{movement.saldoAnterior}</TableCell>
                  <TableCell align="right">{movement.saldoPosterior}</TableCell>
                </TableRow>
              ))}
              {movements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography color="text.secondary">Nenhuma movimentacao registrada.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  )
}

function getProductName(products: Product[], productId: string) {
  return products.find((product) => product.id === productId)?.nome || 'Produto nao encontrado'
}
