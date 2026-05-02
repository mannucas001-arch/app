import type {
  CreateAppointmentInput,
  CreateBreedInput,
  CreateEstoqueLoteInput,
  CreatePetInput,
  CreateProductInput,
  CreateStockEntryInput,
  CreateStockMovementInput,
  CreateTutorInput,
  EstoqueLote,
  ProductCategory,
  ProductType,
  StockEntry,
  StockEntryType,
  StockMovementOrigin,
  StockMovementType,
} from '../domain/entities';
import type { ClinicRepository } from '../repositories/clinic.repository';

const productCategories: ProductCategory[] = [
  'Medicamento',
  'Vacina',
  'Racao',
  'Acessorio',
  'Material cirurgico',
  'Produto de higiene',
  'Material de limpeza',
  'Outros',
];

const productTypes: ProductType[] = ['Produto', 'Medicamento', 'Vacina', 'Servico', 'Material de consumo'];
const stockEntryTypes: StockEntryType[] = ['COMPRA', 'DEVOLUCAO_CLIENTE', 'BONIFICACAO', 'AJUSTE_POSITIVO', 'TRANSFERENCIA'];
const stockMovementTypes: StockMovementType[] = [
  'ENTRADA',
  'SAIDA',
  'ESTORNO_ENTRADA',
  'ESTORNO_SAIDA',
  'AJUSTE_POSITIVO',
  'AJUSTE_NEGATIVO',
];
const stockMovementOrigins: StockMovementOrigin[] = [
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
const positiveStockMovements = new Set<StockMovementType>(['ENTRADA', 'ESTORNO_SAIDA', 'AJUSTE_POSITIVO']);

export class ClinicValidationError extends Error {
  statusCode = 400;
}

export class ClinicService {
  constructor(private readonly repository: ClinicRepository) {}

  getBootstrap() {
    return this.repository.getBootstrap();
  }

  listTutors() {
    return this.repository.listTutors();
  }

  createTutor(input: CreateTutorInput) {
    return this.repository.createTutor(input);
  }

  listPets() {
    return this.repository.listPets();
  }

  createPet(input: CreatePetInput) {
    return this.repository.createPet(input);
  }

  listBreeds() {
    return this.repository.listBreeds();
  }

  createBreed(input: CreateBreedInput) {
    return this.repository.createBreed(input);
  }

  listAppointments() {
    return this.repository.listAppointments();
  }

  createAppointment(input: CreateAppointmentInput) {
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

  createProduct(input: CreateProductInput) {
    const product = normalizeProductInput(input);
    validateProduct(product);

    return this.repository.createProduct(product);
  }

  listStockMovements() {
    return this.repository.listStockMovements();
  }

  async createStockMovement(input: CreateStockMovementInput, usuarioId?: string) {
    return this.registrarMovimentacaoEstoque(input, usuarioId);
  }

  listEstoqueLote() {
    return this.repository.listEstoqueLote();
  }

  getEstoqueLoteByProduct(productId: string) {
    return this.repository.getEstoqueLoteByProduct(productId);
  }

  async createEstoqueLote(input: CreateEstoqueLoteInput) {
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

  async updateEstoqueLote(id: string, quantidadeAtual: number, custoUnitario?: number) {
    return this.repository.updateEstoqueLote(id, quantidadeAtual, custoUnitario);
  }

  async getLotesDisponiveis(productId: string): Promise<EstoqueLote[]> {
    const lotes = await this.repository.getEstoqueLoteByProduct(productId);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    return lotes.filter(lote => 
      lote.ativo && 
      lote.quantidadeAtual > 0 && 
      lote.dataValidade >= hoje
    );
  }

  async getLoteMaisProximoVencimento(productId: string): Promise<EstoqueLote | null> {
    const lotesDisponiveis = await this.getLotesDisponiveis(productId);
    if (lotesDisponiveis.length === 0) return null;
    
    return lotesDisponiveis.sort((a, b) => a.dataValidade.getTime() - b.dataValidade.getTime())[0];
  }

  async baixarQuantidadeLote(loteId: string, quantidade: number): Promise<EstoqueLote> {
    const lote = await this.repository.getEstoqueLoteById(loteId);
    if (!lote) throw new ClinicValidationError('Lote não encontrado');
    
    if (lote.quantidadeAtual < quantidade) {
      throw new ClinicValidationError('Quantidade insuficiente no lote');
    }
    
    const novaQuantidade = lote.quantidadeAtual - quantidade;
    return this.repository.updateEstoqueLote(loteId, novaQuantidade);
  }

  async bloquearLoteVencido(loteId: string): Promise<EstoqueLote> {
    const lote = await this.repository.getEstoqueLoteById(loteId);
    if (!lote) throw new ClinicValidationError('Lote não encontrado');
    
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

  async createStockEntry(input: CreateStockEntryInput) {
    const entry = normalizeStockEntryInput(input);
    validateStockEntry(entry);

    // Validar itens do lote
    for (const item of entry.itens) {
      const product = await this.repository.getProductById(item.produtoId);
      if (!product) throw new ClinicValidationError(`Produto ${item.produtoId} não encontrado`);
      
      if (product.controlaLote && !item.lote) {
        throw new ClinicValidationError(`Produto ${product.nome} requer lote`);
      }
      
      if (product.controlaValidade && !item.validade) {
        throw new ClinicValidationError(`Produto ${product.nome} requer validade`);
      }
    }

    return this.repository.createStockEntry(entry);
  }

  async confirmStockEntry(entryId: string) {
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
        origem: entry.tipo as StockMovementOrigin,
        quantidade: item.quantidade,
        custoUnitario: item.valorUnitario,
        observacao: `Entrada ${entry.documento || ''}`,
        documentoReferencia: entry.documento || '',
      });
    }
    
    return entry;
  }

  async registrarMovimentacaoEstoque(input: CreateStockMovementInput, usuarioId?: string) {
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

function normalizeProductInput(input: CreateProductInput): CreateProductInput {
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

function validateProduct(input: CreateProductInput) {
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

function validateNonNegative(value: number, message: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new ClinicValidationError(message);
  }
}

function normalizeEstoqueLoteInput(input: CreateEstoqueLoteInput): CreateEstoqueLoteInput {
  return {
    produtoId: input.produtoId?.trim() || '',
    numeroLote: input.numeroLote?.trim() || '',
    dataValidade: input.dataValidade ? new Date(input.dataValidade) : new Date(''),
    quantidadeAtual: Number(input.quantidadeAtual ?? 0),
    custoUnitario: Number(input.custoUnitario ?? 0),
    ativo: input.ativo ?? true,
  };
}

function validateEstoqueLote(input: CreateEstoqueLoteInput) {
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

function normalizeStockEntryInput(input: CreateStockEntryInput): CreateStockEntryInput {
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

function validateStockEntry(input: CreateStockEntryInput) {
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

function normalizeStockMovementInput(input: CreateStockMovementInput): CreateStockMovementInput {
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

function validateStockMovementShape(input: CreateStockMovementInput) {
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

function getStockMovementDelta(tipoMovimentacao: StockMovementType, quantidade: number) {
  return positiveStockMovements.has(tipoMovimentacao) ? quantidade : -quantidade;
}
