"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicService = exports.ClinicValidationError = void 0;
const productCategories = [
    'Medicamento',
    'Vacina',
    'Racao',
    'Acessorio',
    'Material cirurgico',
    'Produto de higiene',
    'Material de limpeza',
    'Outros',
];
const productTypes = ['Produto', 'Medicamento', 'Vacina', 'Servico', 'Material de consumo'];
class ClinicValidationError extends Error {
    statusCode = 400;
}
exports.ClinicValidationError = ClinicValidationError;
class ClinicService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    getBootstrap() {
        return this.repository.getBootstrap();
    }
    listTutors() {
        return this.repository.listTutors();
    }
    createTutor(input) {
        return this.repository.createTutor(input);
    }
    listPets() {
        return this.repository.listPets();
    }
    createPet(input) {
        return this.repository.createPet(input);
    }
    listBreeds() {
        return this.repository.listBreeds();
    }
    createBreed(input) {
        return this.repository.createBreed(input);
    }
    listAppointments() {
        return this.repository.listAppointments();
    }
    createAppointment(input) {
        return this.repository.createAppointment(input);
    }
    listMedicalRecords() {
        return this.repository.listMedicalRecords();
    }
    listFinancialEntries() {
        return this.repository.listFinancialEntries();
    }
    listStockItems() {
        return this.repository.listStockItems();
    }
    listProducts() {
        return this.repository.listProducts();
    }
    createProduct(input) {
        const product = normalizeProductInput(input);
        validateProduct(product);
        return this.repository.createProduct(product);
    }
}
exports.ClinicService = ClinicService;
function normalizeProductInput(input) {
    const product = {
        nome: input.nome?.trim() || '',
        codigoInterno: input.codigoInterno?.trim() || '',
        codigoBarras: input.codigoBarras?.trim() || '',
        categoria: input.categoria,
        tipoProduto: input.tipoProduto,
        unidadeMedida: input.unidadeMedida?.trim() || '',
        fornecedorPadraoId: input.fornecedorPadraoId?.trim() || undefined,
        precoCusto: Number(input.precoCusto ?? 0),
        precoVenda: Number(input.precoVenda ?? 0),
        estoqueMinimo: Number(input.estoqueMinimo ?? 0),
        estoqueMaximo: Number(input.estoqueMaximo ?? 0),
        controlaEstoque: Boolean(input.controlaEstoque),
        controlaLote: Boolean(input.controlaLote),
        controlaValidade: Boolean(input.controlaValidade),
        ativo: input.ativo ?? true,
    };
    return {
        ...product,
        controlaEstoque: product.tipoProduto === 'Servico' ? false : product.controlaEstoque,
    };
}
function validateProduct(input) {
    if (!input.nome) {
        throw new ClinicValidationError('Nome do produto e obrigatorio');
    }
    if (!input.categoria || !productCategories.includes(input.categoria)) {
        throw new ClinicValidationError('Categoria do produto e obrigatoria');
    }
    if (!input.tipoProduto || !productTypes.includes(input.tipoProduto)) {
        throw new ClinicValidationError('Tipo do produto e obrigatorio');
    }
    if (!input.unidadeMedida) {
        throw new ClinicValidationError('Unidade de medida e obrigatoria');
    }
    validateNonNegative(input.precoCusto, 'Preco de custo nao pode ser negativo');
    validateNonNegative(input.precoVenda, 'Preco de venda nao pode ser negativo');
    validateNonNegative(input.estoqueMinimo, 'Estoque minimo nao pode ser negativo');
    validateNonNegative(input.estoqueMaximo, 'Estoque maximo nao pode ser negativo');
    if (input.tipoProduto === 'Servico' && input.controlaEstoque) {
        throw new ClinicValidationError('Produtos do tipo Servico nao devem controlar estoque');
    }
}
function validateNonNegative(value, message) {
    if (!Number.isFinite(value) || value < 0) {
        throw new ClinicValidationError(message);
    }
}
