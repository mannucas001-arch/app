import { useEffect, useMemo, useState } from 'react'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Divider,
  Drawer,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material'
import {
  CalendarMonthRounded,
  CategoryRounded,
  DashboardRounded,
  Inventory2Rounded,
  LogoutRounded,
  MedicalInformationRounded,
  MonetizationOnRounded,
  PetsRounded,
  PersonRounded,
  SearchRounded,
} from '@mui/icons-material'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { TutorsPage } from './pages/TutorsPage'
import { PetsPage } from './pages/PetsPage'
import { BreedsPage } from './pages/BreedsPage'
import { AgendaPage } from './pages/AgendaPage'
import { MedicalRecordsPage } from './pages/MedicalRecordsPage'
import { FinancialPage } from './pages/FinancialPage'
import { StockPage } from './pages/StockPage'
import { StockEntryPage } from './pages/StockEntryPage'
import { StockMovementsPage } from './pages/StockMovementsPage'
import { TutorDialog } from './components/dialogs/TutorDialog'
import { BreedDialog } from './components/dialogs/BreedDialog'
import { PetDialog } from './components/dialogs/PetDialog'
import { ProductDialog } from './components/dialogs/ProductDialog'
import { StockMovementDialog } from './components/dialogs/StockMovementDialog'
import { AppointmentDialog } from './components/dialogs/AppointmentDialog'
import { getStoredSession, saveStoredSession, clearStoredSession } from './utils/session'
import type {
  AppointmentStatus,
  AuthUser,
  BootstrapPayload,
  Product,
  ProductStock,
  SectionKey,
  StockEntry,
  StoredSession,
  StockMovement,
  StockMovementOrigin,
  StockMovementType,
} from './types'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const drawerWidth = 270

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f6f7f9',
      paper: '#ffffff',
    },
    primary: {
      main: '#1c6f67',
      dark: '#124a45',
    },
    secondary: {
      main: '#4767c9',
    },
    success: {
      main: '#2f8f5b',
    },
    warning: {
      main: '#c9851b',
    },
    error: {
      main: '#c04b4b',
    },
    text: {
      primary: '#17202a',
      secondary: '#687280',
    },
  },
  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    h6: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
  },
})

const fallbackData: BootstrapPayload = {
  tutors: [
    {
      id: 't-1',
      name: 'Camila Nogueira',
      phone: '(11) 98822-1044',
      email: 'camila.nogueira@email.com',
      address: 'Rua das Palmeiras, 118',
    },
    {
      id: 't-2',
      name: 'Renato Freitas',
      phone: '(21) 97644-5531',
      email: 'renato.freitas@email.com',
      address: 'Av. Atlantica, 340',
    },
  ],
  breeds: [
    { id: 'b-1', name: 'Golden Retriever', species: 'Canino', notes: 'Porte grande, perfil familiar.' },
    { id: 'b-2', name: 'SRD', species: 'Felino', notes: 'Sem raÃ§a definida.' },
  ],
  pets: [
    {
      id: 'p-1',
      name: 'Amora',
      species: 'Canino',
      breedId: 'b-1',
      tutorId: 't-1',
      age: 5,
      weight: 28.4,
      alerts: ['Alergia a dipirona', 'Vacina V10 vence em 21 dias'],
    },
    {
      id: 'p-2',
      name: 'Nino',
      species: 'Felino',
      breedId: 'b-2',
      tutorId: 't-2',
      age: 3,
      weight: 4.8,
      alerts: ['Controle renal semestral'],
    },
  ],
  appointments: [
    {
      id: 'a-1',
      date: '2026-05-01',
      time: '09:00',
      tutorName: 'Camila Nogueira',
      petName: 'Amora',
      veterinarian: 'Dra. Marina Alves',
      reason: 'Consulta de rotina',
      status: 'confirmado',
    },
    {
      id: 'a-2',
      date: '2026-05-01',
      time: '10:30',
      tutorName: 'Renato Freitas',
      petName: 'Nino',
      veterinarian: 'Dr. Theo Ramos',
      reason: 'Retorno nefrologia',
      status: 'aguardando',
    },
  ],
  medicalRecords: [
    {
      id: 'm-1',
      petName: 'Amora',
      tutorName: 'Camila Nogueira',
      date: '2026-04-24',
      summary: 'Paciente ativa, mucosas normocoradas e sem dor Ã  palpaÃ§Ã£o abdominal.',
      prescription: 'Suplemento articular por 30 dias e retorno em 45 dias.',
      vaccines: ['V10', 'Raiva'],
      exams: ['Hemograma completo'],
    },
  ],
  financialEntries: [
    {
      id: 'f-1',
      description: 'Consulta clÃ­nica - Amora',
      category: 'Atendimento',
      type: 'receita',
      amount: 220,
      dueDate: '2026-05-01',
      status: 'pago',
    },
    {
      id: 'f-2',
      description: 'ReposiÃ§Ã£o de vacinas V10',
      category: 'Estoque',
      type: 'despesa',
      amount: 860,
      dueDate: '2026-05-03',
      status: 'pendente',
    },
  ],
  stockItems: [
    { id: 's-1', name: 'Vacina V10', category: 'Vacinas', quantity: 18, minimum: 10, unit: 'doses', status: 'ok' },
    { id: 's-2', name: 'Soro fisiolÃ³gico 500ml', category: 'Insumos', quantity: 7, minimum: 12, unit: 'frascos', status: 'baixo' },
  ],
  products: [
    {
      id: 'prod-1',
      nome: 'Vacina V10',
      codigoInterno: 'VAC-V10',
      codigoBarras: '',
      categoria: 'Vacina',
      tipoProduto: 'Vacina',
      unidadeMedida: 'dose',
      precoCusto: 43,
      precoVenda: 95,
      estoqueMinimo: 10,
      estoqueMaximo: 60,
      controlaEstoque: true,
      controlaLote: true,
      controlaValidade: true,
      ativo: true,
      createdAt: '2026-05-01T09:00:00.000Z',
      updatedAt: '2026-05-01T09:00:00.000Z',
    },
    {
      id: 'prod-2',
      nome: 'Consulta clÃ­nica',
      codigoInterno: 'SERV-CONSULTA',
      codigoBarras: '',
      categoria: 'Outros',
      tipoProduto: 'Servico',
      unidadeMedida: 'serviÃ§o',
      precoCusto: 0,
      precoVenda: 220,
      estoqueMinimo: 0,
      estoqueMaximo: 0,
      controlaEstoque: false,
      controlaLote: false,
      controlaValidade: false,
      ativo: true,
      createdAt: '2026-05-01T09:00:00.000Z',
      updatedAt: '2026-05-01T09:00:00.000Z',
    },
  ],
  stockEntries: [],
  estoquesProduto: [
    {
      id: 'est-prod-1',
      produtoId: 'prod-1',
      quantidadeAtual: 18,
      quantidadeReservada: 0,
      updatedAt: '2026-05-01T09:00:00.000Z',
    },
  ],
  movimentacoesEstoque: [
    {
      id: 'mov-1',
      produtoId: 'prod-1',
      tipoMovimentacao: 'ENTRADA',
      origem: 'COMPRA',
      quantidade: 18,
      saldoAnterior: 0,
      saldoPosterior: 18,
      custoUnitario: 43,
      valorTotal: 774,
      usuarioId: 'u-1',
      observacao: 'Carga inicial de vacinas',
      documentoReferencia: 'NF-1001',
      createdAt: '2026-05-01T09:00:00.000Z',
    },
  ],
  summary: {
    tutors: 2,
    pets: 2,
    breeds: 2,
    appointmentsToday: 2,
    lowStock: 1,
    cashBalance: -640,
  },
}

const navigationGroups = [
  {
    label: 'Principal',
    items: [{ key: 'dashboard', label: 'VisÃ£o geral', icon: <DashboardRounded /> }],
  },
  {
    label: 'Cadastros',
    items: [
      { key: 'tutores', label: 'Tutores', icon: <PersonRounded /> },
      { key: 'pets', label: 'Pets', icon: <PetsRounded /> },
      { key: 'racas', label: 'RaÃ§as', icon: <CategoryRounded /> },
    ],
  },
  {
    label: 'OperaÃ§Ã£o',
    items: [
      { key: 'agenda', label: 'Agenda', icon: <CalendarMonthRounded /> },
      { key: 'prontuario', label: 'ProntuÃ¡rio', icon: <MedicalInformationRounded /> },
      { key: 'financeiro', label: 'Financeiro', icon: <MonetizationOnRounded /> },
    ],
  },
  {
    label: 'Estoque',
    items: [
      { key: 'estoque', label: 'Produtos', icon: <Inventory2Rounded /> },
      { key: 'entradas-estoque', label: 'Entradas', icon: <Inventory2Rounded /> },
      { key: 'movimentacoes-estoque', label: 'Movimentacoes', icon: <Inventory2Rounded /> },
    ],
  },
]

const sections = navigationGroups.flatMap((group) => group.items)

function App() {
  const [activeSection, setActiveSection] = useState<SectionKey>('dashboard')
  const [data, setData] = useState<BootstrapPayload>(fallbackData)
  const [search, setSearch] = useState('')
  const [authChecking, setAuthChecking] = useState(true)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [loginForm, setLoginForm] = useState({ email: 'teste@teste.com', password: 'teste', remember: true })

  const [tutorDialogOpen, setTutorDialogOpen] = useState(false)
  const [breedDialogOpen, setBreedDialogOpen] = useState(false)
  const [petDialogOpen, setPetDialogOpen] = useState(false)
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [stockMovementDialogOpen, setStockMovementDialogOpen] = useState(false)
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)

  const [newTutor, setNewTutor] = useState({ name: '', phone: '', email: '', address: '' })
  const [newBreed, setNewBreed] = useState({ name: '', species: 'Canino', notes: '' })
  const [newPet, setNewPet] = useState({ name: '', species: 'Canino', tutorId: '', breedId: '', age: 0, weight: 0, alerts: '' })
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    nome: '',
    codigoInterno: '',
    codigoBarras: '',
    categoria: 'Medicamento',
    tipoProduto: 'Produto',
    unidadeMedida: 'unidade',
    precoCusto: 0,
    precoVenda: 0,
    estoqueMinimo: 0,
    estoqueMaximo: 0,
    controlaEstoque: true,
    controlaLote: false,
    controlaValidade: false,
    ativo: true,
  })
  const [newStockMovement, setNewStockMovement] = useState({
    produtoId: '',
    loteId: '',
    tipoMovimentacao: 'ENTRADA' as StockMovementType,
    origem: 'AJUSTE_MANUAL' as StockMovementOrigin,
    quantidade: 1,
    custoUnitario: 0,
    observacao: '',
    documentoReferencia: '',
  })
  const [newAppointment, setNewAppointment] = useState({
    date: '2026-05-01',
    time: '15:30',
    tutorName: '',
    petName: '',
    veterinarian: 'Dra. Marina Alves',
    reason: '',
    status: 'aguardando' as AppointmentStatus,
  })

  useEffect(() => {
    const storedSession = getStoredSession()

    if (!storedSession) {
      setAuthChecking(false)
      return
    }

    fetch(`${apiUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${storedSession.token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('SessÃ£o expirada')
        }
        return response.json() as Promise<{ user: AuthUser }>
      })
      .then(({ user }) => {
        setAuthToken(storedSession.token)
        setAuthUser(user)
      })
      .catch(() => {
        clearStoredSession()
      })
      .finally(() => setAuthChecking(false))
  }, [])

  const cashIn = useMemo(
    () => data.financialEntries.filter((entry) => entry.type === 'receita').reduce((sum, entry) => sum + entry.amount, 0),
    [data.financialEntries],
  )

  const cashOut = useMemo(
    () => data.financialEntries.filter((entry) => entry.type === 'despesa').reduce((sum, entry) => sum + entry.amount, 0),
    [data.financialEntries],
  )

  const filteredTutors = useMemo(
    () =>
      data.tutors.filter((tutor) =>
        [tutor.name, tutor.phone, tutor.email].join(' ').toLowerCase().includes(search.toLowerCase()),
      ),
    [data.tutors, search],
  )

  const filteredPets = useMemo(
    () =>
      data.pets.filter((pet) =>
        [pet.name, pet.species, pet.alerts.join(' ')].join(' ').toLowerCase().includes(search.toLowerCase()),
      ),
    [data.pets, search],
  )

  const filteredBreeds = useMemo(
    () =>
      data.breeds.filter((breed) =>
        [breed.name, breed.species, breed.notes].join(' ').toLowerCase().includes(search.toLowerCase()),
      ),
    [data.breeds, search],
  )

  const handleLogin = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      })

      if (!response.ok) {
        throw new Error('Falha ao autenticar')
      }

      const result = (await response.json()) as { token: string; user: AuthUser }
      const session: StoredSession = {
        token: result.token,
        user: result.user,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }
      saveStoredSession(session, loginForm.remember)
      setAuthToken(session.token)
      setAuthUser(session.user)
    } catch {
      const session: StoredSession = {
        token: 'demo-token',
        user: { name: 'UsuÃ¡rio demo', email: loginForm.email },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }
      saveStoredSession(session, loginForm.remember)
      setAuthToken(session.token)
      setAuthUser(session.user)
    }
  }

  const handleLogout = () => {
    clearStoredSession()
    setAuthToken(null)
    setAuthUser(null)
  }

  const handleNewTutor = () => {
    setNewTutor({ name: '', phone: '', email: '', address: '' })
    setTutorDialogOpen(true)
  }

  const handleSaveTutor = () => {
    setData((current) => ({
      ...current,
      tutors: [...current.tutors, { ...newTutor, id: `t-${Date.now()}` }],
    }))
    setTutorDialogOpen(false)
  }

  const handleNewBreed = () => {
    setNewBreed({ name: '', species: 'Canino', notes: '' })
    setBreedDialogOpen(true)
  }

  const handleSaveBreed = () => {
    setData((current) => ({
      ...current,
      breeds: [...current.breeds, { ...newBreed, id: `b-${Date.now()}` }],
    }))
    setBreedDialogOpen(false)
  }

  const handleNewPet = () => {
    setNewPet({ name: '', species: 'Canino', tutorId: '', breedId: '', age: 0, weight: 0, alerts: '' })
    setPetDialogOpen(true)
  }

  const handleSavePet = () => {
    setData((current) => ({
      ...current,
      pets: [
        ...current.pets,
        {
          ...newPet,
          id: `p-${Date.now()}`,
          alerts: newPet.alerts.split(',').map((alert) => alert.trim()).filter(Boolean),
        },
      ],
    }))
    setPetDialogOpen(false)
  }

  const handleNewProduct = () => {
    setEditingProductId(null)
    setNewProduct({
      id: '',
      nome: '',
      codigoInterno: '',
      codigoBarras: '',
      categoria: 'Medicamento',
      tipoProduto: 'Produto',
      unidadeMedida: 'unidade',
      precoCusto: 0,
      precoVenda: 0,
      estoqueMinimo: 0,
      estoqueMaximo: 0,
      controlaEstoque: true,
      controlaLote: false,
      controlaValidade: false,
      ativo: true,
    })
    setProductDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id)
    setNewProduct(product)
    setProductDialogOpen(true)
  }

  const handleSaveProduct = () => {
    setData((current) => {
      const updatedProducts = editingProductId
        ? current.products.map((product) => (product.id === editingProductId ? { ...newProduct, id: editingProductId } : product))
        : [...current.products, { ...newProduct, id: `prod-${Date.now()}` }]
      const createdProduct = updatedProducts[updatedProducts.length - 1]
      const shouldCreateStock = !editingProductId && createdProduct.controlaEstoque

      return {
        ...current,
        products: updatedProducts,
        estoquesProduto: shouldCreateStock
          ? [
              ...current.estoquesProduto,
              {
                id: `est-${createdProduct.id}`,
                produtoId: createdProduct.id,
                quantidadeAtual: 0,
                quantidadeReservada: 0,
                updatedAt: new Date().toISOString(),
              },
            ]
          : current.estoquesProduto,
      }
    })
    setProductDialogOpen(false)
  }

  const handleToggleProductStatus = (productId: string) => {
    setData((current) => ({
      ...current,
      products: current.products.map((product) =>
        product.id === productId ? { ...product, ativo: !product.ativo } : product,
      ),
    }))
  }

  const handleNewStockMovement = (product?: Product) => {
    setNewStockMovement({
      produtoId: product?.id || '',
      loteId: '',
      tipoMovimentacao: 'ENTRADA',
      origem: 'AJUSTE_MANUAL',
      quantidade: 1,
      custoUnitario: product?.precoCusto || 0,
      observacao: '',
      documentoReferencia: '',
    })
    setStockMovementDialogOpen(true)
  }

  const handleSaveStockMovement = async () => {
    const product = data.products.find((item) => item.id === newStockMovement.produtoId)

    if (!product || !product.ativo || !product.controlaEstoque || newStockMovement.quantidade <= 0) {
      return
    }

    const saldoAnterior = getCurrentStockBalance(data.estoquesProduto, newStockMovement.produtoId)
    const saldoPosterior =
      saldoAnterior + getStockMovementDelta(newStockMovement.tipoMovimentacao, Number(newStockMovement.quantidade))

    if (saldoPosterior < 0) {
      return
    }
    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      produtoId: newStockMovement.produtoId,
      loteId: newStockMovement.loteId || undefined,
      tipoMovimentacao: newStockMovement.tipoMovimentacao,
      origem: newStockMovement.origem,
      quantidade: Number(newStockMovement.quantidade),
      saldoAnterior,
      saldoPosterior,
      custoUnitario: Number(newStockMovement.custoUnitario),
      valorTotal: Number(newStockMovement.quantidade) * Number(newStockMovement.custoUnitario),
      observacao: newStockMovement.observacao,
      documentoReferencia: newStockMovement.documentoReferencia,
      createdAt: new Date().toISOString(),
    }

    setData((current) => ({
      ...current,
      estoquesProduto: upsertProductStock(current.estoquesProduto, movement.produtoId, movement.saldoPosterior),
      movimentacoesEstoque: [movement, ...current.movimentacoesEstoque],
    }))
    setStockMovementDialogOpen(false)

    await fetch(`${apiUrl}/stock-movements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && authToken !== 'demo-token' ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({
        produtoId: movement.produtoId,
        loteId: movement.loteId,
        tipoMovimentacao: movement.tipoMovimentacao,
        origem: movement.origem,
        quantidade: movement.quantidade,
        custoUnitario: movement.custoUnitario,
        observacao: movement.observacao,
        documentoReferencia: movement.documentoReferencia,
      }),
    }).catch(() => undefined)
  }

  const handleNewAppointment = () => {
    setNewAppointment({ date: '2026-05-01', time: '15:30', tutorName: '', petName: '', veterinarian: 'Dra. Marina Alves', reason: '', status: 'aguardando' })
    setAppointmentDialogOpen(true)
  }

  const handleSaveAppointment = () => {
    setData((current) => ({
      ...current,
      appointments: [...current.appointments, { ...newAppointment, id: `a-${Date.now()}` }],
    }))
    setAppointmentDialogOpen(false)
  }

  const handleCreateStockEntry = (entry: Omit<StockEntry, 'id' | 'createdAt'>) => {
    const newEntry: StockEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setData((current) => ({
      ...current,
      stockEntries: [...current.stockEntries, newEntry],
    }))
  }

  const handleConfirmStockEntry = (entryId: string) => {
    setData((current) => {
      const entry = current.stockEntries.find((e) => e.id === entryId)
      if (!entry || entry.confirmado) return current

      const movements: StockMovement[] = []
      let updatedProducts = [...current.products]
      let updatedEstoques = [...current.estoquesProduto]

      entry.itens.forEach((item) => {
        const product = current.products.find((p) => p.id === item.produtoId)
        if (!product) return

        // Atualizar preço de custo
        updatedProducts = updatedProducts.map((p) =>
          p.id === item.produtoId ? { ...p, precoCusto: item.valorUnitario } : p
        )

        // Atualizar estoque
        const estoqueIndex = updatedEstoques.findIndex((e) => e.produtoId === item.produtoId)
        if (estoqueIndex >= 0) {
          updatedEstoques[estoqueIndex] = {
            ...updatedEstoques[estoqueIndex],
            quantidadeAtual: updatedEstoques[estoqueIndex].quantidadeAtual + item.quantidade,
            updatedAt: new Date().toISOString(),
          }
        } else {
          updatedEstoques.push({
            id: `est-${item.produtoId}`,
            produtoId: item.produtoId,
            quantidadeAtual: item.quantidade,
            quantidadeReservada: 0,
            updatedAt: new Date().toISOString(),
          })
        }

        // Criar movimento
        const saldoAnterior = updatedEstoques[estoqueIndex]?.quantidadeAtual ?? 0
        movements.push({
          id: `mov-${Date.now()}-${item.produtoId}`,
          produtoId: item.produtoId,
          loteId: item.lote ? `lote-${item.lote}` : undefined,
          tipoMovimentacao: entry.tipo === 'AJUSTE_POSITIVO' ? 'AJUSTE_POSITIVO' : 'ENTRADA',
          origem: entry.tipo,
          quantidade: item.quantidade,
          saldoAnterior,
          saldoPosterior: saldoAnterior + item.quantidade,
          custoUnitario: item.valorUnitario,
          valorTotal: item.quantidade * item.valorUnitario,
          observacao: entry.observacao || '',
          documentoReferencia: entry.documento || entry.id,
          createdAt: new Date().toISOString(),
        })
      })

      return {
        ...current,
        products: updatedProducts,
        estoquesProduto: updatedEstoques,
        movimentacoesEstoque: [...current.movimentacoesEstoque, ...movements],
        stockEntries: current.stockEntries.map((e) => (e.id === entryId ? { ...e, confirmado: true } : e)),
      }
    })
  }

  if (authChecking) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!authToken) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginPage
          email={loginForm.email}
          password={loginForm.password}
          remember={loginForm.remember}
          onEmailChange={(value) => setLoginForm((current) => ({ ...current, email: value }))}
          onPasswordChange={(value) => setLoginForm((current) => ({ ...current, password: value }))}
          onRememberChange={(checked) => setLoginForm((current) => ({ ...current, remember: checked }))}
          onLogin={handleLogin}
        />
      </ThemeProvider>
    )
  }

  const activeSectionLabel = sections.find((item) => item.key === activeSection)?.label || ''

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Drawer
          variant="permanent"
          slotProps={{
            paper: {
              sx: {
                width: drawerWidth,
                borderRight: '1px solid #e1e7ef',
                bgcolor: '#ffffff',
              },
            },
          }}
          sx={{ width: drawerWidth, flexShrink: 0 }}
        >
          <Toolbar sx={{ px: 3 }}>
            <Stack spacing={1}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                VetPrime
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ClÃ­nica veterinÃ¡ria
              </Typography>
            </Stack>
          </Toolbar>
          <Divider />
          <Box sx={{ overflow: 'auto', px: 1.5, pt: 1 }}>
            <List disablePadding>
              {navigationGroups.map((group) => (
                <Box key={group.label} sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ pl: 2, textTransform: 'uppercase', letterSpacing: 0.9 }}>
                    {group.label}
                  </Typography>
                  {group.items.map((item) => (
                    <ListItemButton
                      key={item.key}
                      selected={activeSection === item.key}
                      onClick={() => setActiveSection(item.key as SectionKey)}
                      sx={{ borderRadius: 2, my: 0.5 }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  ))}
                </Box>
              ))}
            </List>
          </Box>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, ml: `${drawerWidth}px` }}>
          <AppBar position="fixed" color="inherit" elevation={1} sx={{ width: `calc(100% - ${drawerWidth}px)`, bgcolor: '#ffffff' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {activeSectionLabel}
                </Typography>
                <TextField
                  size="small"
                  placeholder="Buscar"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
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
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{authUser?.name?.slice(0, 1) ?? 'U'}</Avatar>
                <Stack spacing={0.25}>
                  <Typography sx={{ fontWeight: 700 }}>{authUser?.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {authUser?.email}
                  </Typography>
                </Stack>
                <Button startIcon={<LogoutRounded />} onClick={handleLogout}>
                  Sair
                </Button>
              </Stack>
            </Toolbar>
          </AppBar>

          <Toolbar />
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            {activeSection === 'dashboard' && (
              <DashboardPage data={data} cashIn={cashIn} cashOut={cashOut} onNewAppointment={handleNewAppointment} />
            )}
            {activeSection === 'tutores' && (
              <TutorsPage tutors={filteredTutors} pets={data.pets} search={search} onSearch={setSearch} onNewTutor={handleNewTutor} />
            )}
            {activeSection === 'pets' && (
              <PetsPage pets={filteredPets} tutors={data.tutors} breeds={data.breeds} search={search} onSearch={setSearch} onNewPet={handleNewPet} />
            )}
            {activeSection === 'racas' && (
              <BreedsPage breeds={filteredBreeds} pets={data.pets} search={search} onSearch={setSearch} onNewBreed={handleNewBreed} />
            )}
            {activeSection === 'agenda' && <AgendaPage appointments={data.appointments} onNewAppointment={handleNewAppointment} />}
            {activeSection === 'prontuario' && <MedicalRecordsPage records={data.medicalRecords} />}
            {activeSection === 'financeiro' && <FinancialPage entries={data.financialEntries} cashIn={cashIn} cashOut={cashOut} />}
            {activeSection === 'estoque' && (
              <StockPage
                products={data.products}
                productStocks={data.estoquesProduto}
                onNewProduct={handleNewProduct}
                onNewStockMovement={handleNewStockMovement}
                onEditProduct={handleEditProduct}
                onToggleProductStatus={handleToggleProductStatus}
              />
            )}
            {activeSection === 'entradas-estoque' && (
              <StockEntryPage
                products={data.products}
                stockEntries={data.stockEntries}
                onCreateEntry={handleCreateStockEntry}
                onConfirmEntry={handleConfirmStockEntry}
              />
            )}
            {activeSection === 'movimentacoes-estoque' && (
              <StockMovementsPage products={data.products} movements={data.movimentacoesEstoque} onNewStockMovement={handleNewStockMovement} />
            )}
          </Box>
        </Box>
      </Box>

      <TutorDialog
        open={tutorDialogOpen}
        value={newTutor}
        onChange={setNewTutor}
        onClose={() => setTutorDialogOpen(false)}
        onSave={handleSaveTutor}
      />

      <BreedDialog
        open={breedDialogOpen}
        value={newBreed}
        onChange={setNewBreed}
        onClose={() => setBreedDialogOpen(false)}
        onSave={handleSaveBreed}
      />

      <PetDialog
        open={petDialogOpen}
        value={newPet}
        tutors={data.tutors}
        breeds={data.breeds}
        onChange={setNewPet}
        onClose={() => setPetDialogOpen(false)}
        onSave={handleSavePet}
      />

      <ProductDialog
        open={productDialogOpen}
        value={newProduct}
        onChange={setNewProduct}
        onClose={() => setProductDialogOpen(false)}
        onSave={handleSaveProduct}
      />

      <StockMovementDialog
        open={stockMovementDialogOpen}
        value={newStockMovement}
        products={data.products}
        onChange={setNewStockMovement}
        onClose={() => setStockMovementDialogOpen(false)}
        onSave={handleSaveStockMovement}
      />

      <AppointmentDialog
        open={appointmentDialogOpen}
        value={newAppointment}
        tutors={data.tutors}
        onChange={setNewAppointment}
        onStatusChange={(event) => setNewAppointment((current) => ({ ...current, status: event.target.value as AppointmentStatus }))}
        onClose={() => setAppointmentDialogOpen(false)}
        onSave={handleSaveAppointment}
      />
    </ThemeProvider>
  )
}

function getCurrentStockBalance(productStocks: ProductStock[], productId: string) {
  return productStocks.find((stock) => stock.produtoId === productId)?.quantidadeAtual || 0
}

function getStockMovementDelta(tipoMovimentacao: StockMovementType, quantidade: number) {
  return ['ENTRADA', 'ESTORNO_SAIDA', 'AJUSTE_POSITIVO'].includes(tipoMovimentacao) ? quantidade : -quantidade
}

function upsertProductStock(productStocks: ProductStock[], productId: string, quantidadeAtual: number) {
  const now = new Date().toISOString()
  const existingStock = productStocks.find((stock) => stock.produtoId === productId)

  if (!existingStock) {
    return [
      ...productStocks,
      {
        id: `est-${productId}`,
        produtoId: productId,
        quantidadeAtual,
        quantidadeReservada: 0,
        updatedAt: now,
      },
    ]
  }

  return productStocks.map((stock) =>
    stock.produtoId === productId ? { ...stock, quantidadeAtual, updatedAt: now } : stock,
  )
}

export default App
