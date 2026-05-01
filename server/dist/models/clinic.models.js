"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = exports.StockItemModel = exports.FinancialEntryModel = exports.MedicalRecordModel = exports.AppointmentModel = exports.TutorModel = exports.PetModel = exports.BreedModel = exports.SessionModel = exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const baseOptions = {
    versionKey: false,
    timestamps: true,
};
const breedSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    species: { type: String, required: true },
    notes: { type: String, default: '' },
}, baseOptions);
const petSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    species: { type: String, required: true },
    breedId: { type: String, required: true, index: true },
    tutorId: { type: String, required: true, index: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    alerts: { type: [String], default: [] },
}, baseOptions);
const userSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, enum: ['admin', 'veterinario', 'recepcionista'], required: true },
    passwordHash: { type: String },
}, baseOptions);
const sessionSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, baseOptions);
const tutorSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
}, baseOptions);
const appointmentSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    tutorName: { type: String, required: true },
    petName: { type: String, required: true },
    veterinarian: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['confirmado', 'aguardando', 'em_atendimento'], required: true },
}, baseOptions);
const medicalRecordSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    petName: { type: String, required: true },
    tutorName: { type: String, required: true },
    date: { type: String, required: true },
    summary: { type: String, required: true },
    prescription: { type: String, required: true },
    vaccines: { type: [String], default: [] },
    exams: { type: [String], default: [] },
}, baseOptions);
const financialEntrySchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, enum: ['receita', 'despesa'], required: true },
    amount: { type: Number, required: true },
    dueDate: { type: String, required: true },
    status: { type: String, enum: ['pago', 'pendente', 'vencido'], required: true },
}, baseOptions);
const stockItemSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    minimum: { type: Number, required: true },
    unit: { type: String, required: true },
    status: { type: String, enum: ['ok', 'baixo', 'critico'], required: true },
}, baseOptions);
const productSchema = new mongoose_1.Schema({
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
}, baseOptions);
exports.UserModel = mongoose_1.models.User || (0, mongoose_1.model)('User', userSchema);
exports.SessionModel = mongoose_1.models.Session || (0, mongoose_1.model)('Session', sessionSchema);
exports.BreedModel = mongoose_1.models.Breed || (0, mongoose_1.model)('Breed', breedSchema);
exports.PetModel = mongoose_1.models.Pet || (0, mongoose_1.model)('Pet', petSchema);
exports.TutorModel = mongoose_1.models.Tutor || (0, mongoose_1.model)('Tutor', tutorSchema);
exports.AppointmentModel = mongoose_1.models.Appointment || (0, mongoose_1.model)('Appointment', appointmentSchema);
exports.MedicalRecordModel = mongoose_1.models.MedicalRecord || (0, mongoose_1.model)('MedicalRecord', medicalRecordSchema);
exports.FinancialEntryModel = mongoose_1.models.FinancialEntry || (0, mongoose_1.model)('FinancialEntry', financialEntrySchema);
exports.StockItemModel = mongoose_1.models.StockItem || (0, mongoose_1.model)('StockItem', stockItemSchema);
exports.ProductModel = mongoose_1.models.Product || (0, mongoose_1.model)('Product', productSchema);
