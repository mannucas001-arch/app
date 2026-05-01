import { Schema, model, models } from 'mongoose';
import type {
  Appointment,
  Breed,
  FinancialEntry,
  EstoqueProduto,
  MedicalRecord,
  MovimentacaoEstoque,
  Pet,
  Product,
  Session,
  StockItem,
  Tutor,
  User,
} from '../domain/entities';

const baseOptions = {
  versionKey: false as const,
  timestamps: true as const,
};

const breedSchema = new Schema<Breed>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    species: { type: String, required: true },
    notes: { type: String, default: '' },
  },
  baseOptions,
);

const petSchema = new Schema<Pet>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    species: { type: String, required: true },
    breedId: { type: String, required: true, index: true },
    tutorId: { type: String, required: true, index: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    alerts: { type: [String], default: [] },
  },
  baseOptions,
);

const userSchema = new Schema<User>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, enum: ['admin', 'veterinario', 'recepcionista'], required: true },
    passwordHash: { type: String },
  },
  baseOptions,
);

const sessionSchema = new Schema<Session>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  baseOptions,
);

const tutorSchema = new Schema<Tutor>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
  },
  baseOptions,
);

const appointmentSchema = new Schema<Appointment>(
  {
    id: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    tutorName: { type: String, required: true },
    petName: { type: String, required: true },
    veterinarian: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['confirmado', 'aguardando', 'em_atendimento'], required: true },
  },
  baseOptions,
);

const medicalRecordSchema = new Schema<MedicalRecord>(
  {
    id: { type: String, required: true, unique: true },
    petName: { type: String, required: true },
    tutorName: { type: String, required: true },
    date: { type: String, required: true },
    summary: { type: String, required: true },
    prescription: { type: String, required: true },
    vaccines: { type: [String], default: [] },
    exams: { type: [String], default: [] },
  },
  baseOptions,
);

const financialEntrySchema = new Schema<FinancialEntry>(
  {
    id: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, enum: ['receita', 'despesa'], required: true },
    amount: { type: Number, required: true },
    dueDate: { type: String, required: true },
    status: { type: String, enum: ['pago', 'pendente', 'vencido'], required: true },
  },
  baseOptions,
);

const stockItemSchema = new Schema<StockItem>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    minimum: { type: Number, required: true },
    unit: { type: String, required: true },
    status: { type: String, enum: ['ok', 'baixo', 'critico'], required: true },
  },
  baseOptions,
);

const productSchema = new Schema<Product>(
  {
    id: { type: String, required: true, unique: true },
    nome: { type: String, required: true, trim: true },
    codigoInterno: { type: String, default: '', trim: true },
    codigoBarras: { type: String, default: '', trim: true },
    categoria: {
      type: String,
      enum: [
        'Medicamento',
        'Vacina',
        'Racao',
        'Acessorio',
        'Material cirurgico',
        'Produto de higiene',
        'Material de limpeza',
        'Outros',
      ],
      required: true,
    },
    tipoProduto: {
      type: String,
      enum: ['Produto', 'Medicamento', 'Vacina', 'Servico', 'Material de consumo'],
      required: true,
    },
    unidadeMedida: { type: String, required: true, trim: true },
    fornecedorPadraoId: { type: String },
    precoCusto: { type: Number, required: true, min: 0 },
    precoVenda: { type: Number, required: true, min: 0 },
    estoqueMinimo: { type: Number, required: true, min: 0 },
    estoqueMaximo: { type: Number, required: true, min: 0 },
    controlaEstoque: { type: Boolean, required: true, default: true },
    controlaLote: { type: Boolean, required: true, default: false },
    controlaValidade: { type: Boolean, required: true, default: false },
    ativo: { type: Boolean, required: true, default: true },
  },
  baseOptions,
);

const stockMovementSchema = new Schema<MovimentacaoEstoque>(
  {
    id: { type: String, required: true, unique: true },
    produtoId: { type: String, required: true, index: true },
    loteId: { type: String },
    tipoMovimentacao: {
      type: String,
      enum: ['ENTRADA', 'SAIDA', 'ESTORNO_ENTRADA', 'ESTORNO_SAIDA', 'AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO'],
      required: true,
    },
    origem: {
      type: String,
      enum: [
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
      ],
      required: true,
    },
    quantidade: { type: Number, required: true, min: 0 },
    saldoAnterior: { type: Number, required: true },
    saldoPosterior: { type: Number, required: true },
    custoUnitario: { type: Number, required: true, min: 0 },
    valorTotal: { type: Number, required: true, min: 0 },
    usuarioId: { type: String },
    observacao: { type: String, default: '' },
    documentoReferencia: { type: String, default: '' },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const productStockSchema = new Schema<EstoqueProduto>(
  {
    id: { type: String, required: true, unique: true },
    produtoId: { type: String, required: true, unique: true, index: true },
    quantidadeAtual: { type: Number, required: true, min: 0, default: 0 },
    quantidadeReservada: { type: Number, required: true, min: 0, default: 0 },
  },
  {
    versionKey: false,
    timestamps: { createdAt: false, updatedAt: true },
  },
);

export const UserModel = models.User || model<User>('User', userSchema);
export const SessionModel = models.Session || model<Session>('Session', sessionSchema);
export const BreedModel = models.Breed || model<Breed>('Breed', breedSchema);
export const PetModel = models.Pet || model<Pet>('Pet', petSchema);
export const TutorModel = models.Tutor || model<Tutor>('Tutor', tutorSchema);
export const AppointmentModel = models.Appointment || model<Appointment>('Appointment', appointmentSchema);
export const MedicalRecordModel =
  models.MedicalRecord || model<MedicalRecord>('MedicalRecord', medicalRecordSchema);
export const FinancialEntryModel =
  models.FinancialEntry || model<FinancialEntry>('FinancialEntry', financialEntrySchema);
export const StockItemModel = models.StockItem || model<StockItem>('StockItem', stockItemSchema);
export const ProductModel = models.Product || model<Product>('Product', productSchema);
export const StockMovementModel =
  models.MovimentacaoEstoque || model<MovimentacaoEstoque>('MovimentacaoEstoque', stockMovementSchema);
export const ProductStockModel =
  models.EstoqueProduto || model<EstoqueProduto>('EstoqueProduto', productStockSchema);
