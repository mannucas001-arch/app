import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  FormControl,
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
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material'
import { AddRounded, EditRounded, ToggleOffRounded, ToggleOnRounded } from '@mui/icons-material'
import type { Product, ProductCategory, ProductStock } from '../types'
import { productCategories } from '../types'
import type { Order } from '../utils/sort'
import { getComparator } from '../utils/sort'


const headCells = [
  { id: 'nome', label: 'Produto' },
  { id: 'categoria', label: 'Categoria' },
  { id: 'tipoProduto', label: 'Tipo' },
  { id: 'precoCusto', label: 'PreÃ§o custo', align: 'right' },
  { id: 'precoVenda', label: 'PreÃ§o venda', align: 'right' },
  { id: 'estoqueMinimo', label: 'Estoque mÃ­nimo', align: 'center' },
]

type OrderKey = keyof Product

type Props = {
  products: Product[]
  productStocks: ProductStock[]
  onNewProduct: () => void
  onNewStockMovement: (product?: Product) => void
  onEditProduct: (product: Product) => void
  onToggleProductStatus: (productId: string) => void
}

export function StockPage({ products, productStocks, onNewProduct, onNewStockMovement, onEditProduct, onToggleProductStatus }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'Todos'>('Todos')
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativos' | 'inativos'>('todos')
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<OrderKey>('nome')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()

    return products
      .filter((product) => {
        const matchesTerm =
          !term ||
          [product.nome, product.codigoInterno, product.codigoBarras].join(' ').toLowerCase().includes(term)
        const matchesCategory = categoryFilter === 'Todos' || product.categoria === categoryFilter
        const matchesStatus =
          statusFilter === 'todos' ||
          (statusFilter === 'ativos' ? product.ativo : !product.ativo)

        return matchesTerm && matchesCategory && matchesStatus
      })
      .sort(getComparator<OrderKey>(order, orderBy))
  }, [products, searchTerm, categoryFilter, statusFilter, order, orderBy])

  useEffect(() => {
    if (page > 0 && page * rowsPerPage >= filteredProducts.length) {
      setPage(0)
    }
  }, [filteredProducts.length, page, rowsPerPage])

  const handleRequestSort = (property: OrderKey) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>
          Estoque / Produtos
        </Typography>
        <Typography variant="h4">Produtos e serviÃ§os</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, maxWidth: 720 }}>
          Cadastro base para itens que podem ou nÃ£o controlar estoque, lote e validade.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button startIcon={<AddRounded />} variant="contained" size="large" onClick={onNewProduct}>
            Novo produto
          </Button>
          <Button startIcon={<AddRounded />} variant="outlined" size="large" onClick={() => onNewStockMovement()}>
            Nova movimentacao
          </Button>
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', maxWidth: 880 }}>
          <TextField
            size="small"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por nome, cÃ³digo interno ou cÃ³digo de barras"
            sx={{ minWidth: 220, flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={categoryFilter}
              label="Categoria"
              onChange={(event) => setCategoryFilter(event.target.value as ProductCategory | 'Todos')}
            >
              <MenuItem value="Todos">Todos</MenuItem>
              {productCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(event) => setStatusFilter(event.target.value as 'todos' | 'ativos' | 'inativos')}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="ativos">Ativos</MenuItem>
              <MenuItem value="inativos">Inativos</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Paper variant="outlined" sx={{ borderColor: '#e1e7ef', overflow: 'hidden', boxShadow: '0 16px 40px rgba(23, 32, 42, 0.05)' }}>
        <TableContainer>
          <Table size="small" sx={{ display: { xs: 'none', md: 'table' } }}>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id} align={headCell.align || 'left'} sortDirection={orderBy === headCell.id ? order : false}>
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleRequestSort(headCell.id as OrderKey)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="center">Saldo</TableCell>
                <TableCell>Controle</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">AÃ§Ãµes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 800 }}>{product.nome}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {product.codigoInterno || 'Sem cÃ³digo interno'} Â· {product.codigoBarras || 'Sem cÃ³digo de barras'}
                    </Typography>
                  </TableCell>
                  <TableCell>{product.categoria}</TableCell>
                  <TableCell>
                    <Chip label={product.tipoProduto} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">{product.precoCusto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                  <TableCell align="right">{product.precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                  <TableCell align="center">{product.estoqueMinimo}</TableCell>
                  <TableCell align="center">{getCurrentStockBalance(productStocks, product.id)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                      <Chip
                        label={product.controlaEstoque ? 'Estoque' : 'NÃ£o controla'}
                        size="small"
                        color={product.controlaEstoque ? 'success' : 'default'}
                        variant="outlined"
                      />
                      {product.controlaLote && <Chip label="Lote" size="small" variant="outlined" />}
                      {product.controlaValidade && <Chip label="Validade" size="small" variant="outlined" />}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.ativo ? 'Ativo' : 'Inativo'}
                      color={product.ativo ? 'success' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <Button size="small" variant="outlined" startIcon={<EditRounded />} onClick={() => onEditProduct(product)}>
                        Editar
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddRounded />}
                        onClick={() => onNewStockMovement(product)}
                        disabled={!product.ativo || !product.controlaEstoque}
                      >
                        Movimentar
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color={product.ativo ? 'error' : 'success'}
                        startIcon={product.ativo ? <ToggleOffRounded /> : <ToggleOnRounded />}
                        onClick={() => onToggleProductStatus(product.id)}
                      >
                        {product.ativo ? 'Inativar' : 'Ativar'}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: { xs: 'block', md: 'none' }, p: 2 }}>
          <Stack spacing={2}>
            {filteredProducts.length === 0 && <Typography color="text.secondary">Nenhum produto encontrado.</Typography>}
            {filteredProducts.map((product) => (
              <Paper key={product.id} variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 800 }}>{product.nome}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {product.codigoInterno || 'Sem cÃ³digo interno'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {product.codigoBarras || 'Sem cÃ³digo de barras'}
                      </Typography>
                    </Box>
                    <Chip label={product.ativo ? 'Ativo' : 'Inativo'} color={product.ativo ? 'success' : 'default'} size="small" variant="outlined" />
                  </Stack>
                  <Typography color="text.secondary">Categoria: {product.categoria}</Typography>
                  <Typography color="text.secondary">Tipo: {product.tipoProduto}</Typography>
                  <Typography color="text.secondary">Unidade: {product.unidadeMedida}</Typography>
                  <Typography color="text.secondary">Saldo: {getCurrentStockBalance(productStocks, product.id)}</Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                    <Chip label={`Custo ${product.precoCusto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`} size="small" variant="outlined" />
                    <Chip label={`Venda ${product.precoVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`} size="small" variant="outlined" />
                    <Chip label={`MÃ­nimo ${product.estoqueMinimo}`} size="small" variant="outlined" />
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                    <Chip
                      label={product.controlaEstoque ? 'Estoque' : 'NÃ£o controla'}
                      size="small"
                      color={product.controlaEstoque ? 'success' : 'default'}
                      variant="outlined"
                    />
                    {product.controlaLote && <Chip label="Lote" size="small" variant="outlined" />}
                    {product.controlaValidade && <Chip label="Validade" size="small" variant="outlined" />}
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <Button size="small" variant="outlined" startIcon={<EditRounded />} onClick={() => onEditProduct(product)}>
                      Editar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AddRounded />}
                      onClick={() => onNewStockMovement(product)}
                      disabled={!product.ativo || !product.controlaEstoque}
                    >
                      Movimentar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color={product.ativo ? 'error' : 'success'}
                      startIcon={product.ativo ? <ToggleOffRounded /> : <ToggleOnRounded />}
                      onClick={() => onToggleProductStatus(product.id)}
                    >
                      {product.ativo ? 'Inativar' : 'Ativar'}
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>

        <TablePagination
          component="div"
          count={filteredProducts.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10))
            setPage(0)
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </Stack>
  )
}

function getCurrentStockBalance(productStocks: ProductStock[], productId: string) {
  return productStocks.find((stock) => stock.produtoId === productId)?.quantidadeAtual || 0
}
