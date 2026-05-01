import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import type { Product, StockMovementOrigin, StockMovementType } from '../../types'
import { stockMovementOrigins, stockMovementTypes } from '../../types'

type StockMovementForm = {
  produtoId: string
  loteId: string
  tipoMovimentacao: StockMovementType
  origem: StockMovementOrigin
  quantidade: number
  custoUnitario: number
  observacao: string
  documentoReferencia: string
}

type Props = {
  open: boolean
  value: StockMovementForm
  products: Product[]
  onChange: (value: StockMovementForm) => void
  onClose: () => void
  onSave: () => void
}

export function StockMovementDialog({ open, value, products, onChange, onClose, onSave }: Props) {
  const selectedProduct = products.find((product) => product.id === value.produtoId)
  const validProduct = Boolean(selectedProduct?.ativo && selectedProduct.controlaEstoque)

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Nova movimentacao de estoque</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <FormControl>
            <InputLabel>Produto</InputLabel>
            <Select
              value={value.produtoId}
              label="Produto"
              onChange={(event) => {
                const product = products.find((item) => item.id === event.target.value)
                onChange({
                  ...value,
                  produtoId: event.target.value,
                  custoUnitario: product?.precoCusto ?? value.custoUnitario,
                })
              }}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id} disabled={!product.ativo || !product.controlaEstoque}>
                  {product.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={value.tipoMovimentacao}
                label="Tipo"
                onChange={(event) => onChange({ ...value, tipoMovimentacao: event.target.value as StockMovementType })}
              >
                {stockMovementTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Origem</InputLabel>
              <Select
                value={value.origem}
                label="Origem"
                onChange={(event) => onChange({ ...value, origem: event.target.value as StockMovementOrigin })}
              >
                {stockMovementOrigins.map((origin) => (
                  <MenuItem key={origin} value={origin}>
                    {origin}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Quantidade"
              type="number"
              value={value.quantidade}
              onChange={(event) => onChange({ ...value, quantidade: Number(event.target.value) })}
              fullWidth
            />
            <TextField
              label="Custo unitario"
              type="number"
              value={value.custoUnitario}
              onChange={(event) => onChange({ ...value, custoUnitario: Number(event.target.value) })}
              fullWidth
            />
            <TextField
              label="Lote"
              value={value.loteId}
              onChange={(event) => onChange({ ...value, loteId: event.target.value })}
              fullWidth
            />
          </Stack>

          <TextField
            label="Documento de referencia"
            value={value.documentoReferencia}
            onChange={(event) => onChange({ ...value, documentoReferencia: event.target.value })}
          />
          <TextField
            label="Observacao"
            value={value.observacao}
            onChange={(event) => onChange({ ...value, observacao: event.target.value })}
            multiline
            minRows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={!value.produtoId || !validProduct || value.quantidade <= 0 || value.custoUnitario < 0}
        >
          Registrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
