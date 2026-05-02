import { useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { AddRounded, DeleteRounded } from '@mui/icons-material'
import type { Product, StockEntry, StockEntryItem, StockEntryType } from '../types'

type Props = {
  products: Product[]
  stockEntries: StockEntry[]
  onCreateEntry: (entry: Omit<StockEntry, 'id' | 'createdAt'>) => void
  onConfirmEntry: (entryId: string) => void
}

const entryTypes: { value: StockEntryType; label: string }[] = [
  { value: 'COMPRA', label: 'Compra' },
  { value: 'DEVOLUCAO_CLIENTE', label: 'Devolução do Cliente' },
  { value: 'BONIFICACAO', label: 'Bonificação' },
  { value: 'AJUSTE_POSITIVO', label: 'Ajuste Positivo' },
  { value: 'TRANSFERENCIA', label: 'Transferência' },
]

export function StockEntryPage({ products, stockEntries, onCreateEntry, onConfirmEntry }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<StockEntry | null>(null)
  const [entryForm, setEntryForm] = useState({
    fornecedor: '',
    data: new Date().toISOString().split('T')[0],
    tipo: 'COMPRA' as StockEntryType,
    documento: '',
    observacao: '',
    itens: [] as StockEntryItem[],
  })

  const handleNewEntry = () => {
    setEditingEntry(null)
    setEntryForm({
      fornecedor: '',
      data: new Date().toISOString().split('T')[0],
      tipo: 'COMPRA',
      documento: '',
      observacao: '',
      itens: [],
    })
    setDialogOpen(true)
  }

  const handleAddItem = () => {
    const newItem: StockEntryItem = {
      id: `item-${Date.now()}`,
      produtoId: '',
      quantidade: 1,
      valorUnitario: 0,
      lote: '',
      validade: '',
    }
    setEntryForm((prev) => ({
      ...prev,
      itens: [...prev.itens, newItem],
    }))
  }

  const handleUpdateItem = (itemId: string, updates: Partial<StockEntryItem>) => {
    setEntryForm((prev) => ({
      ...prev,
      itens: prev.itens.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
    }))
  }

  const handleRemoveItem = (itemId: string) => {
    setEntryForm((prev) => ({
      ...prev,
      itens: prev.itens.filter((item) => item.id !== itemId),
    }))
  }

  const validateEntry = () => {
    if (!entryForm.data) return 'Data é obrigatória'
    if (entryForm.itens.length === 0) return 'Adicione pelo menos um item'

    for (const item of entryForm.itens) {
      if (!item.produtoId) return 'Produto é obrigatório para todos os itens'
      if (item.quantidade <= 0) return 'Quantidade deve ser maior que zero'
      if (item.valorUnitario < 0) return 'Valor unitário não pode ser negativo'

      const product = products.find((p) => p.id === item.produtoId)
      if (!product) return 'Produto não encontrado'
      if (!product.ativo) return 'Produto deve estar ativo'
      if (!product.controlaEstoque) return 'Produto deve controlar estoque'

      if (product.controlaLote && !item.lote) return 'Lote é obrigatório para este produto'
      if (product.controlaValidade && !item.validade) return 'Validade é obrigatória para este produto'
    }

    return null
  }

  const handleSaveEntry = () => {
    const error = validateEntry()
    if (error) {
      alert(error)
      return
    }

    const entry: Omit<StockEntry, 'id' | 'createdAt'> = {
      ...entryForm,
      confirmado: false,
    }

    onCreateEntry(entry)
    setDialogOpen(false)
  }

  const handleConfirmEntry = (entryId: string) => {
    onConfirmEntry(entryId)
  }

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ alignItems: { lg: 'center' }, justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
            Estoque / Entradas
          </Typography>
          <Typography variant="h4">Entradas de Estoque</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5, maxWidth: 680 }}>
            Registre entradas de produtos no estoque por compra, devolução ou ajuste.
          </Typography>
        </Box>
        <Button startIcon={<AddRounded />} variant="contained" size="large" onClick={handleNewEntry}>
          Nova Entrada
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ borderColor: '#e1e7ef', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Fornecedor</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Itens</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockEntries.map((entry) => (
                <TableRow key={entry.id} hover>
                  <TableCell>{new Date(entry.data).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{entryTypes.find((t) => t.value === entry.tipo)?.label}</TableCell>
                  <TableCell>{entry.fornecedor || '-'}</TableCell>
                  <TableCell>{entry.documento || '-'}</TableCell>
                  <TableCell>{entry.itens.length} itens</TableCell>
                  <TableCell>
                    <Chip
                      label={entry.confirmado ? 'Confirmada' : 'Pendente'}
                      color={entry.confirmado ? 'success' : 'warning'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {!entry.confirmado && (
                      <Button size="small" onClick={() => handleConfirmEntry(entry.id)}>
                        Confirmar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>{editingEntry ? 'Editar Entrada' : 'Nova Entrada'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
              <TextField
                label="Fornecedor"
                value={entryForm.fornecedor}
                onChange={(e) => setEntryForm((prev) => ({ ...prev, fornecedor: e.target.value }))}
              />
              <TextField
                type="date"
                label="Data"
                value={entryForm.data}
                onChange={(e) => setEntryForm((prev) => ({ ...prev, data: e.target.value }))}
                slotProps={{ inputLabel: { shrink: true } }}
                required
              />
              <FormControl required>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={entryForm.tipo}
                  label="Tipo"
                  onChange={(e) => setEntryForm((prev) => ({ ...prev, tipo: e.target.value as StockEntryType }))}
                >
                  {entryTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' } }}>
              <TextField
                label="Documento/NF"
                value={entryForm.documento}
                onChange={(e) => setEntryForm((prev) => ({ ...prev, documento: e.target.value }))}
              />
              <TextField
                label="Observação"
                value={entryForm.observacao}
                onChange={(e) => setEntryForm((prev) => ({ ...prev, observacao: e.target.value }))}
                multiline
                rows={2}
              />
            </Box>

            <Box>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Itens</Typography>
                <Button startIcon={<AddRounded />} onClick={handleAddItem}>
                  Adicionar Item
                </Button>
              </Stack>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Produto</TableCell>
                      <TableCell align="right">Quantidade</TableCell>
                      <TableCell align="right">Valor Unitário</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Lote</TableCell>
                      <TableCell>Validade</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entryForm.itens.map((item) => {
                      const product = products.find((p) => p.id === item.produtoId)
                      const total = item.quantidade * item.valorUnitario
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <FormControl fullWidth size="small">
                              <InputLabel>Produto</InputLabel>
                              <Select
                                value={item.produtoId}
                                label="Produto"
                                onChange={(e) => handleUpdateItem(item.id, { produtoId: e.target.value })}
                              >
                                {products
                                  .filter((p) => p.ativo && p.controlaEstoque)
                                  .map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                      {product.nome}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              variant="outlined"
                              type="number"
                              size="small"
                              value={item.quantidade}
                              onChange={(e) => handleUpdateItem(item.id, { quantidade: Number(e.target.value) })}
                              slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              variant="outlined"
                              type="number"
                              size="small"
                              value={item.valorUnitario}
                              onChange={(e) => handleUpdateItem(item.id, { valorUnitario: Number(e.target.value) })}
                              slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                            />
                          </TableCell>
                          <TableCell align="right">R$ {total.toFixed(2)}</TableCell>
                          <TableCell>
                            {product?.controlaLote && (
                              <TextField
                                size="small"
                                value={item.lote}
                                onChange={(e) => handleUpdateItem(item.id, { lote: e.target.value })}
                                required
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            {product?.controlaValidade && (
                              <TextField
                                type="date"
                                size="small"
                                value={item.validade}
                                onChange={(e) => handleUpdateItem(item.id, { validade: e.target.value })}
                                slotProps={{ inputLabel: { shrink: true } }}
                                required
                              />
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" onClick={() => handleRemoveItem(item.id)}>
                              <DeleteRounded />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveEntry}>
            Salvar Entrada
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
