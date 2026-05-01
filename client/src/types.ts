export type AppointmentStatus = 'aguardando' | 'confirmado' | 'em_atendimento'
export type FinancialStatus = 'pago' | 'pendente' | 'vencido'
export type StockStatus = 'ok' | 'baixo' | 'critico'
export type ProductCategory =
  | 'Medicamento'
  | 'Vacina'
  | 'Racao'
  | 'Acessorio'
  | 'Material cirurgico'
  | 'Produto de higiene'
  | 'Material de limpeza'
  | 'Outros'
export type ProductType = 'Produto' | 'Medicamento' | 'Vacina' | 'Servico' | 'Material de consumo'
export type StockMovementType =
  | 'ENTRADA'
  | 'SAIDA'
  | 'ESTORNO_ENTRADA'
  | 'ESTORNO_SAIDA'
  | 'AJUSTE_POSITIVO'
  | 'AJUSTE_NEGATIVO'
export type StockMovementOrigin =
  | 'COMPRA'
  | 'VENDA'
  | 'ATENDIMENTO'
  | 'VACINACAO'
  | 'PROCEDIMENTO'
  | 'INVENTARIO'
  | 'AJUSTE_MANUAL'
  | 'CANCELAMENTO'
  | 'DEVOLUCAO'
  | 'TRANSFERENCIA'
  | 'DEVOLUCAO_CLIENTE'
  | 'BONIFICACAO'
  | 'AJUSTE_POSITIVO'

export type Tutor = {
  id: string
  name: string
  phone: string
  email: string
  address: string
}

export type Pet = {
  id: string
  name: string
  species: string
  tutorId: string
  breedId: string
  age: number
  weight: number
  alerts: string[]
}

export type Breed = {
  id: string
  name: string
  species: string
  notes?: string
}

export type Appointment = {
  id: string
  date: string
  time: string
  tutorName: string
  petName: string
  veterinarian: string
  reason: string
  status: AppointmentStatus
}

export type MedicalRecord = {
  id: string
  petName: string
  tutorName: string
  date: string
  summary: string
  prescription: string
  vaccines: string[]
  exams: string[]
}

export type FinancialEntry = {
  id: string
  description: string
  category: string
  type: 'receita' | 'despesa'
  dueDate: string
  status: FinancialStatus
  amount: number
}

export type StockItem = {
  id: string
  name: string
  category: string
  quantity: number
  minimum: number
  unit: string
  status: StockStatus
}

export type Product = {
  id: string
  nome: string
  codigoInterno: string
  codigoBarras: string
  categoria: ProductCategory
  tipoProduto: ProductType
  unidadeMedida: string
  precoCusto: number
  precoVenda: number
  estoqueMinimo: number
  estoqueMaximo: number
  controlaEstoque: boolean
  controlaLote: boolean
  controlaValidade: boolean
  ativo: boolean
  createdAt?: string
  updatedAt?: string
}

export type StockEntryType = 'COMPRA' | 'DEVOLUCAO_CLIENTE' | 'BONIFICACAO' | 'AJUSTE_POSITIVO' | 'TRANSFERENCIA'

export type StockEntry = {
  id: string
  fornecedor?: string
  data: string
  tipo: StockEntryType
  documento?: string
  observacao?: string
  itens: StockEntryItem[]
  confirmado: boolean
  createdAt: string
}

export type StockEntryItem = {
  id: string
  produtoId: string
  quantidade: number
  valorUnitario: number
  lote?: string
  validade?: string
}

export type StockMovement = {
  id: string
  produtoId: string
  loteId?: string
  tipoMovimentacao: StockMovementType
  origem: StockMovementOrigin
  quantidade: number
  saldoAnterior: number
  saldoPosterior: number
  custoUnitario: number
  valorTotal: number
  usuarioId?: string
  observacao: string
  documentoReferencia: string
  createdAt: string
}

export type ProductStock = {
  id: string
  produtoId: string
  quantidadeAtual: number
  quantidadeReservada: number
  updatedAt: string
}

export type EstoqueLote = {
  id: string
  produtoId: string
  numeroLote: string
  dataValidade: string
  quantidadeAtual: number
  custoUnitario: number
  ativo: boolean
  createdAt: string
  updatedAt: string
}

export type AuthUser = {
  name: string
  email: string
}

export type StoredSession = {
  token: string
  user: AuthUser
  expiresAt: string
}

export type BootstrapPayload = {
  tutors: Tutor[]
  pets: Pet[]
  breeds: Breed[]
  appointments: Appointment[]
  medicalRecords: MedicalRecord[]
  financialEntries: FinancialEntry[]
  stockItems: StockItem[]
  products: Product[]
  stockEntries: StockEntry[]
  estoquesProduto: ProductStock[]
  estoquesLote: EstoqueLote[]
  movimentacoesEstoque: StockMovement[]
  summary: {
    tutors: number
    pets: number
    breeds: number
    appointmentsToday: number
    lowStock: number
    cashBalance: number
  }
}

export type SectionKey =
  | 'dashboard'
  | 'tutores'
  | 'pets'
  | 'racas'
  | 'agenda'
  | 'prontuario'
  | 'financeiro'
  | 'estoque'
  | 'entradas-estoque'
  | 'movimentacoes-estoque'

export type NavigationItem = {
  key: SectionKey
  label: string
}

export type NavigationGroup = {
  label: string
  items: NavigationItem[]
}

export const productCategories: ProductCategory[] = [
  'Medicamento',
  'Vacina',
  'Racao',
  'Acessorio',
  'Material cirurgico',
  'Produto de higiene',
  'Material de limpeza',
  'Outros',
]
export const productTypes: ProductType[] = ['Produto', 'Medicamento', 'Vacina', 'Servico', 'Material de consumo']
export const stockMovementTypes: StockMovementType[] = [
  'ENTRADA',
  'SAIDA',
  'ESTORNO_ENTRADA',
  'ESTORNO_SAIDA',
  'AJUSTE_POSITIVO',
  'AJUSTE_NEGATIVO',
]
export const stockMovementOrigins: StockMovementOrigin[] = [
  'COMPRA',
  'VENDA',
  'ATENDIMENTO',
  'VACINACAO',
  'PROCEDIMENTO',
  'INVENTARIO',
  'AJUSTE_MANUAL',
  'CANCELAMENTO',
  'DEVOLUCAO',
  'TRANSFERENCIA',
]
