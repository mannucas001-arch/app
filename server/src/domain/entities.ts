export type Role = 'admin' | 'veterinario' | 'recepcionista';
export type AppointmentStatus = 'confirmado' | 'aguardando' | 'em_atendimento';
export type FinancialStatus = 'pago' | 'pendente' | 'vencido';
export type StockStatus = 'ok' | 'baixo' | 'critico';
export type ProductCategory =
  | 'Medicamento'
  | 'Vacina'
  | 'Racao'
  | 'Acessorio'
  | 'Material cirurgico'
  | 'Produto de higiene'
  | 'Material de limpeza'
  | 'Outros';
export type ProductType = 'Produto' | 'Medicamento' | 'Vacina' | 'Servico' | 'Material de consumo';
export type StockMovementType =
  | 'ENTRADA'
  | 'SAIDA'
  | 'ESTORNO_ENTRADA'
  | 'ESTORNO_SAIDA'
  | 'AJUSTE_POSITIVO'
  | 'AJUSTE_NEGATIVO';
export type StockMovementOrigin =
  | 'COMPRA'
  | 'DEVOLUCAO_CLIENTE'
  | 'BONIFICACAO'
  | 'VENDA'
  | 'ATENDIMENTO'
  | 'VACINACAO'
  | 'PROCEDIMENTO'
  | 'INVENTARIO'
  | 'AJUSTE_MANUAL'
  | 'AJUSTE_POSITIVO'
  | 'CANCELAMENTO'
  | 'DEVOLUCAO'
  | 'TRANSFERENCIA';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  passwordHash?: string;
};

export type PublicUser = Omit<User, 'passwordHash'>;

export type Session = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

export type LoginInput = {
  email: string;
  password: string;
  remember: boolean;
};

export type AuthSession = {
  token: string;
  expiresAt: Date;
  user: PublicUser;
};

export type Breed = {
  id: string;
  name: string;
  species: string;
  notes: string;
};

export type Pet = {
  id: string;
  name: string;
  species: string;
  breedId: string;
  tutorId: string;
  age: number;
  weight: number;
  alerts: string[];
};

export type Tutor = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
};

export type Appointment = {
  id: string;
  date: string;
  time: string;
  tutorName: string;
  petName: string;
  veterinarian: string;
  reason: string;
  status: AppointmentStatus;
};

export type MedicalRecord = {
  id: string;
  petName: string;
  tutorName: string;
  date: string;
  summary: string;
  prescription: string;
  vaccines: string[];
  exams: string[];
};

export type FinancialEntry = {
  id: string;
  description: string;
  category: string;
  type: 'receita' | 'despesa';
  amount: number;
  dueDate: string;
  status: FinancialStatus;
};

export type StockItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minimum: number;
  unit: string;
  status: StockStatus;
};

export type Product = {
  id: string;
  nome: string;
  codigoInterno: string;
  codigoBarras: string;
  categoria: ProductCategory;
  tipoProduto: ProductType;
  unidadeMedida: string;
  fornecedorPadraoId?: string;
  precoCusto: number;
  precoVenda: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  controlaEstoque: boolean;
  controlaLote: boolean;
  controlaValidade: boolean;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type MovimentacaoEstoque = {
  id: string;
  produtoId: string;
  loteId?: string;
  tipoMovimentacao: StockMovementType;
  origem: StockMovementOrigin;
  quantidade: number;
  saldoAnterior: number;
  saldoPosterior: number;
  custoUnitario: number;
  valorTotal: number;
  usuarioId?: string;
  observacao: string;
  documentoReferencia: string;
  createdAt: Date;
};

export type EstoqueProduto = {
  id: string;
  produtoId: string;
  quantidadeAtual: number;
  quantidadeReservada: number;
  updatedAt: Date;
};

export type EstoqueLote = {
  id: string;
  produtoId: string;
  numeroLote: string;
  dataValidade: Date;
  quantidadeAtual: number;
  custoUnitario: number;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ClinicSummary = {
  tutors: number;
  pets: number;
  breeds: number;
  appointmentsToday: number;
  lowStock: number;
  cashBalance: number;
};

export type BootstrapPayload = {
  users: User[];
  tutors: Tutor[];
  pets: Pet[];
  breeds: Breed[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  financialEntries: FinancialEntry[];
  stockItems: StockItem[];
  products: Product[];
  stockEntries: StockEntry[];
  estoquesProduto: EstoqueProduto[];
  estoquesLote: EstoqueLote[];
  movimentacoesEstoque: MovimentacaoEstoque[];
  summary: ClinicSummary;
};

export type CreateTutorInput = Omit<Tutor, 'id'>;

export type CreateBreedInput = Omit<Breed, 'id'>;

export type CreatePetInput = Omit<Pet, 'id'>;

export type CreateAppointmentInput = Omit<Appointment, 'id' | 'status'> & {
  status?: AppointmentStatus;
};

export type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export type CreateStockMovementInput = Omit<
  MovimentacaoEstoque,
  'id' | 'saldoAnterior' | 'saldoPosterior' | 'valorTotal' | 'createdAt'
>;

export type StockEntryType = 'COMPRA' | 'DEVOLUCAO_CLIENTE' | 'BONIFICACAO' | 'AJUSTE_POSITIVO' | 'TRANSFERENCIA';

export type StockEntry = {
  id: string;
  fornecedor?: string;
  data: string;
  tipo: StockEntryType;
  documento?: string;
  observacao?: string;
  itens: StockEntryItem[];
  confirmado: boolean;
  createdAt: Date;
};

export type StockEntryItem = {
  id: string;
  produtoId: string;
  quantidade: number;
  valorUnitario: number;
  lote?: string;
  validade?: Date;
};

export type CreateStockEntryInput = Omit<StockEntry, 'id' | 'itens' | 'confirmado' | 'createdAt'> & {
  itens: Omit<StockEntryItem, 'id'>[];
};

export type CreateEstoqueLoteInput = Omit<EstoqueLote, 'id' | 'createdAt' | 'updatedAt'>;
