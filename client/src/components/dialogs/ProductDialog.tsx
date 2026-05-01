import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import type { Product, ProductCategory, ProductType } from '../../types'
import { productCategories, productTypes } from '../../types'

type Props = {
  open: boolean
  value: Product
  onChange: (value: Product) => void
  onClose: () => void
  onSave: () => void
}

export function ProductDialog({ open, value, onChange, onClose, onSave }: Props) {
  const serviceProduct = value.tipoProduto === 'Servico'

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Novo produto</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1.4fr 1fr' } }}>
            <TextField label="Nome" value={value.nome} onChange={(event) => onChange({ ...value, nome: event.target.value })} />
            <TextField
              label="Código interno"
              value={value.codigoInterno}
              onChange={(event) => onChange({ ...value, codigoInterno: event.target.value })}
            />
          </Box>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' } }}>
            <TextField
              label="Código de barras"
              value={value.codigoBarras}
              onChange={(event) => onChange({ ...value, codigoBarras: event.target.value })}
            />
            <FormControl>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={value.categoria}
                label="Categoria"
                onChange={(event) => onChange({ ...value, categoria: event.target.value as ProductCategory })}
              >
                {productCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={value.tipoProduto}
                label="Tipo"
                onChange={(event) => {
                  const tipoProduto = event.target.value as ProductType
                  onChange({
                    ...value,
                    tipoProduto,
                    controlaEstoque: tipoProduto === 'Servico' ? false : value.controlaEstoque,
                  })
                }}
              >
                {productTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(5, 1fr)' } }}>
            <TextField label="Unidade" value={value.unidadeMedida} onChange={(event) => onChange({ ...value, unidadeMedida: event.target.value })} />
            <TextField
              label="Custo"
              type="number"
              value={value.precoCusto}
              onChange={(event) => onChange({ ...value, precoCusto: Number(event.target.value) })}
            />
            <TextField
              label="Venda"
              type="number"
              value={value.precoVenda}
              onChange={(event) => onChange({ ...value, precoVenda: Number(event.target.value) })}
            />
            <TextField
              label="Estoque min."
              type="number"
              value={value.estoqueMinimo}
              onChange={(event) => onChange({ ...value, estoqueMinimo: Number(event.target.value) })}
            />
            <TextField
              label="Estoque max."
              type="number"
              value={value.estoqueMaximo}
              onChange={(event) => onChange({ ...value, estoqueMaximo: Number(event.target.value) })}
            />
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!serviceProduct && value.controlaEstoque}
                  disabled={serviceProduct}
                  onChange={(event) => onChange({ ...value, controlaEstoque: event.target.checked })}
                />
              }
              label="Controla estoque"
            />
            <FormControlLabel
              control={
                <Checkbox checked={value.controlaLote} onChange={(event) => onChange({ ...value, controlaLote: event.target.checked })} />
              }
              label="Controla lote"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={value.controlaValidade}
                  onChange={(event) => onChange({ ...value, controlaValidade: event.target.checked })}
                />
              }
              label="Controla validade"
            />
            <FormControlLabel
              control={<Checkbox checked={value.ativo} onChange={(event) => onChange({ ...value, ativo: event.target.checked })} />}
              label="Ativo"
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={!value.nome || !value.categoria || !value.unidadeMedida || value.precoCusto < 0 || value.precoVenda < 0 || value.estoqueMinimo < 0 || value.estoqueMaximo < 0}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
