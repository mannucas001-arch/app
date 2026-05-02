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
const stockEntryTypes = ['COMPRA', 'DEVOLUCAO_CLIENTE', 'BONIFICACAO', 'AJUSTE_POSITIVO', 'TRANSFERENCIA'];
const stockMovementTypes = [
    'ENTRADA',
    'SAIDA',
    'ESTORNO_ENTRADA',
    'ESTORNO_SAIDA',
    'AJUSTE_POSITIVO',
    'AJUSTE_NEGATIVO',
];
const stockMovementOrigins = [
    'COMPRA',
    'DEVOLUCAO_CLIENTE',
    'BONIFICACAO',
    'VENDA',
    'ATENDIMENTO',
    'VACINACAO',
    'PROCEDIMENTO',
    'INVENTARIO',
    'AJUSTE_MANUAL',
    'AJUSTE_POSITIVO',
    'CANCELAMENTO',
    'DEVOLUCAO',
    'TRANSFERENCIA',
];
const positiveStockMovements = new Set(['ENTRADA', 'ESTORNO_SAIDA', 'AJUSTE_POSITIVO']);
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
    listProductStocks() {
        return this.repository.listProductStocks();
    }
    createProduct(input) {
        const product = normalizeProductInput(input);
        validateProduct(product);
        return this.repository.createProduct(product);
    }
    listStockMovements() {
        return this.repository.listStockMovements();
    }
    async createStockMovement(input, usuarioId) {
        return this.registrarMovimentacaoEstoque(input, usuarioId);
    }
    listEstoqueLote() {
        return this.repository.listEstoqueLote();
    }
    getEstoqueLoteByProduct(productId) {
        return this.repository.getEstoqueLoteByProduct(productId);
    }
    async createEstoqueLote(input) {
        const lote = normalizeEstoqueLoteInput(input);
        validateEstoqueLote(lote);
        // Verificar se já existe lote com mesmo número para o produto
        const existingLotes = await this.repository.getEstoqueLoteByProduct(lote.produtoId);
        const duplicate = existingLotes.find(l => l.numeroLote === lote.numeroLote && l.dataValidade.getTime() === lote.dataValidade.getTime());
        if (duplicate) {
            // Somar quantidade ao lote existente
            return this.repository.updateEstoqueLote(duplicate.id, duplicate.quantidadeAtual + lote.quantidadeAtual, lote.custoUnitario);
        }
        return this.repository.createEstoqueLote(lote);
    }
    async updateEstoqueLote(id, quantidadeAtual, custoUnitario) {
        return this.repository.updateEstoqueLote(id, quantidadeAtual, custoUnitario);
    }
    async getLotesDisponiveis(productId) {
        const lotes = await this.repository.getEstoqueLoteByProduct(productId);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        return lotes.filter(lote => lote.ativo &&
            lote.quantidadeAtual > 0 &&
            lote.dataValidade >= hoje);
    }
    async getLoteMaisProximoVencimento(productId) {
        const lotesDisponiveis = await this.getLotesDisponiveis(productId);
        if (lotesDisponiveis.length === 0)
            return null;
        return lotesDisponiveis.sort((a, b) => a.dataValidade.getTime() - b.dataValidade.getTime())[0];
    }
    async baixarQuantidadeLote(loteId, quantidade) {
        const lote = await this.repository.getEstoqueLoteById(loteId);
        if (!lote)
            throw new ClinicValidationError('Lote não encontrado');
        if (lote.quantidadeAtual < quantidade) {
            throw new ClinicValidationError('Quantidade insuficiente no lote');
        }
        const novaQuantidade = lote.quantidadeAtual - quantidade;
        return this.repository.updateEstoqueLote(loteId, novaQuantidade);
    }
    async bloquearLoteVencido(loteId) {
        const lote = await this.repository.getEstoqueLoteById(loteId);
        if (!lote)
            throw new ClinicValidationError('Lote não encontrado');
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        if (lote.dataValidade >= hoje) {
            throw new ClinicValidationError('Lote ainda não venceu');
        }
        // Desativar lote
        lote.ativo = false;
        lote.quantidadeAtual = 0;
        return this.repository.updateEstoqueLote(loteId, 0);
    }
    async createStockEntry(input) {
        const entry = normalizeStockEntryInput(input);
        validateStockEntry(entry);
        // Validar itens do lote
        for (const item of entry.itens) {
            const product = await this.repository.getProductById(item.produtoId);
            if (!product)
                throw new ClinicValidationError(`Produto ${item.produtoId} não encontrado`);
            if (product.controlaLote && !item.lote) {
                throw new ClinicValidationError(`Produto ${product.nome} requer lote`);
            }
            if (product.controlaValidade && !item.validade) {
                throw new ClinicValidationError(`Produto ${product.nome} requer validade`);
            }
        }
        return this.repository.createStockEntry(entry);
    }
    async confirmStockEntry(entryId) {
        const entry = await this.repository.confirmStockEntry(entryId);
        // Processar itens da entrada
        for (const item of entry.itens) {
            if (item.lote && item.validade) {
                // Criar ou atualizar lote
                await this.createEstoqueLote({
                    produtoId: item.produtoId,
                    numeroLote: item.lote,
                    dataValidade: item.validade,
                    quantidadeAtual: item.quantidade,
                    custoUnitario: item.valorUnitario,
                    ativo: true,
                });
            }
            // Registrar movimento de entrada
            await this.registrarMovimentacaoEstoque({
                produtoId: item.produtoId,
                loteId: item.lote ? undefined : undefined, // TODO: implementar busca de loteId
                tipoMovimentacao: 'ENTRADA',
                origem: entry.tipo,
                quantidade: item.quantidade,
                custoUnitario: item.valorUnitario,
                observacao: `Entrada ${entry.documento || ''}`,
                documentoReferencia: entry.documento || '',
            });
        }
        return entry;
    }
    async registrarMovimentacaoEstoque(input, usuarioId) {
        const movement = normalizeStockMovementInput({ ...input, usuarioId: input.usuarioId || usuarioId });
        validateStockMovementShape(movement);
        const product = await this.repository.getProductById(movement.produtoId);
        if (!product) {
            throw new ClinicValidationError('Produto nao encontrado');
        }
        if (!product.ativo) {
            throw new ClinicValidationError('Nao e permitido movimentar produto inativo');
        }
        if (!product.controlaEstoque) {
            throw new ClinicValidationError('Nao e permitido movimentar produto que nao controla estoque');
        }
        const productStock = (await this.repository.getProductStock(product.id)) || (await this.repository.createProductStock(product.id));
        const saldoAnterior = productStock.quantidadeAtual;
        const delta = getStockMovementDelta(movement.tipoMovimentacao, movement.quantidade);
        const saldoPosterior = saldoAnterior + delta;
        if (saldoPosterior < 0) {
            throw new ClinicValidationError('Saldo insuficiente para saida de estoque');
        }
        const createdMovement = await this.repository.createStockMovement({
            ...movement,
            saldoAnterior,
            saldoPosterior,
        });
        await this.repository.updateProductStock(product.id, saldoPosterior);
        return createdMovement;
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
function normalizeEstoqueLoteInput(input) {
    return {
        produtoId: input.produtoId?.trim() || '',
        numeroLote: input.numeroLote?.trim() || '',
        dataValidade: input.dataValidade ? new Date(input.dataValidade) : new Date(''),
        quantidadeAtual: Number(input.quantidadeAtual ?? 0),
        custoUnitario: Number(input.custoUnitario ?? 0),
        ativo: input.ativo ?? true,
    };
}
function validateEstoqueLote(input) {
    if (!input.produtoId) {
        throw new ClinicValidationError('Produto e obrigatorio para o lote');
    }
    if (!input.numeroLote) {
        throw new ClinicValidationError('Numero do lote e obrigatorio');
    }
    if (Number.isNaN(input.dataValidade.getTime())) {
        throw new ClinicValidationError('Validade do lote e obrigatoria');
    }
    if (!Number.isFinite(input.quantidadeAtual) || input.quantidadeAtual <= 0) {
        throw new ClinicValidationError('Quantidade do lote deve ser maior que zero');
    }
    validateNonNegative(input.custoUnitario, 'Custo unitario nao pode ser negativo');
}
function normalizeStockEntryInput(input) {
    return {
        fornecedor: input.fornecedor?.trim() || undefined,
        data: input.data?.trim() || '',
        tipo: input.tipo,
        documento: input.documento?.trim() || undefined,
        observacao: input.observacao?.trim() || undefined,
        itens: (input.itens || []).map((item) => ({
            produtoId: item.produtoId?.trim() || '',
            quantidade: Number(item.quantidade ?? 0),
            valorUnitario: Number(item.valorUnitario ?? 0),
            lote: item.lote?.trim() || undefined,
            validade: item.validade ? new Date(item.validade) : undefined,
        })),
    };
}
function validateStockEntry(input) {
    if (!input.data) {
        throw new ClinicValidationError('Data da entrada e obrigatoria');
    }
    if (!input.tipo || !stockEntryTypes.includes(input.tipo)) {
        throw new ClinicValidationError('Tipo da entrada de estoque invalido');
    }
    if (!input.itens.length) {
        throw new ClinicValidationError('Entrada de estoque deve ter ao menos um item');
    }
    input.itens.forEach((item) => {
        if (!item.produtoId) {
            throw new ClinicValidationError('Produto e obrigatorio para todos os itens');
        }
        if (!Number.isFinite(item.quantidade) || item.quantidade <= 0) {
            throw new ClinicValidationError('Quantidade do item deve ser maior que zero');
        }
        validateNonNegative(item.valorUnitario, 'Valor unitario nao pode ser negativo');
        if (item.validade && Number.isNaN(item.validade.getTime())) {
            throw new ClinicValidationError('Validade do item invalida');
        }
    });
}
function normalizeStockMovementInput(input) {
    return {
        produtoId: input.produtoId?.trim() || '',
        loteId: input.loteId?.trim() || undefined,
        tipoMovimentacao: input.tipoMovimentacao,
        origem: input.origem,
        quantidade: Number(input.quantidade ?? 0),
        custoUnitario: Number(input.custoUnitario ?? 0),
        usuarioId: input.usuarioId?.trim() || undefined,
        observacao: input.observacao?.trim() || '',
        documentoReferencia: input.documentoReferencia?.trim() || '',
    };
}
function validateStockMovementShape(input) {
    if (!input.produtoId) {
        throw new ClinicValidationError('Produto e obrigatorio para movimentacao de estoque');
    }
    if (!input.tipoMovimentacao || !stockMovementTypes.includes(input.tipoMovimentacao)) {
        throw new ClinicValidationError('Tipo de movimentacao invalido');
    }
    if (!input.origem || !stockMovementOrigins.includes(input.origem)) {
        throw new ClinicValidationError('Origem da movimentacao invalida');
    }
    if (!Number.isFinite(input.quantidade) || input.quantidade <= 0) {
        throw new ClinicValidationError('Quantidade deve ser maior que zero');
    }
    validateNonNegative(input.custoUnitario, 'Custo unitario nao pode ser negativo');
}
function getStockMovementDelta(tipoMovimentacao, quantidade) {
    return positiveStockMovements.has(tipoMovimentacao) ? quantidade : -quantidade;
}
