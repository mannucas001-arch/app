import type {
  Appointment,
  Breed,
  BootstrapPayload,
  CreateAppointmentInput,
  CreateBreedInput,
  CreateEstoqueLoteInput,
  CreatePetInput,
  CreateProductInput,
  CreateStockEntryInput,
  CreateStockMovementInput,
  CreateTutorInput,
  EstoqueLote,
  EstoqueProduto,
  FinancialEntry,
  MedicalRecord,
  MovimentacaoEstoque,
  Pet,
  Product,
  StockEntry,
  StockItem,
  Tutor,
  User,
} from '../domain/entities';
import { defaultBreeds } from '../data/default-breeds';
import {
  AppointmentModel,
  BreedModel,
  EstoqueLoteModel,
  FinancialEntryModel,
  MedicalRecordModel,
  PetModel,
  ProductModel,
  ProductStockModel,
  StockEntryModel,
  StockMovementModel,
  StockItemModel,
  TutorModel,
  UserModel,
} from '../models/clinic.models';
import { toPublicUser } from './auth.repository';

export interface ClinicRepository {
  getBootstrap(): Promise<BootstrapPayload>;
  listTutors(): Promise<Tutor[]>;
  createTutor(input: CreateTutorInput): Promise<Tutor>;
  listPets(): Promise<Pet[]>;
  createPet(input: CreatePetInput): Promise<Pet>;
  listBreeds(): Promise<Breed[]>;
  createBreed(input: CreateBreedInput): Promise<Breed>;
  listAppointments(): Promise<Appointment[]>;
  createAppointment(input: CreateAppointmentInput): Promise<Appointment>;
  listMedicalRecords(): Promise<MedicalRecord[]>;
  listFinancialEntries(): Promise<FinancialEntry[]>;
  listStockItems(): Promise<StockItem[]>;
  listProducts(): Promise<Product[]>;
  createProduct(input: CreateProductInput): Promise<Product>;
  getProductById(productId: string): Promise<Product | null>;
  listProductStocks(): Promise<EstoqueProduto[]>;
  getProductStock(productId: string): Promise<EstoqueProduto | null>;
  createProductStock(productId: string): Promise<EstoqueProduto>;
  updateProductStock(productId: string, quantidadeAtual: number): Promise<EstoqueProduto>;
  listStockMovements(): Promise<MovimentacaoEstoque[]>;
  createStockMovement(input: CreateStockMovementInput & { saldoAnterior: number; saldoPosterior: number }): Promise<MovimentacaoEstoque>;
  listEstoqueLote(): Promise<EstoqueLote[]>;
  getEstoqueLoteById(id: string): Promise<EstoqueLote | null>;
  getEstoqueLoteByProduct(productId: string): Promise<EstoqueLote[]>;
  createEstoqueLote(input: CreateEstoqueLoteInput): Promise<EstoqueLote>;
  updateEstoqueLote(id: string, quantidadeAtual: number, custoUnitario?: number): Promise<EstoqueLote>;
  listStockEntries(): Promise<StockEntry[]>;
  createStockEntry(input: CreateStockEntryInput): Promise<StockEntry>;
  confirmStockEntry(entryId: string): Promise<StockEntry>;
}

function calculateSummary(
  tutors: Tutor[],
  pets: Pet[],
  breeds: Breed[],
  appointments: Appointment[],
  financialEntries: FinancialEntry[],
  stockItems: StockItem[],
) {
  const today = formatDateKey(new Date());
  const receivables = financialEntries
    .filter((entry) => entry.type === 'receita')
    .reduce((total, entry) => total + entry.amount, 0);
  const payables = financialEntries
    .filter((entry) => entry.type === 'despesa')
    .reduce((total, entry) => total + entry.amount, 0);

  return {
    tutors: tutors.length,
    pets: pets.length,
    breeds: breeds.length,
    appointmentsToday: appointments.filter((appointment) => appointment.date === today).length,
    lowStock: stockItems.filter((item) => item.status !== 'ok').length,
    cashBalance: receivables - payables,
  };
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export class MemoryClinicRepository implements ClinicRepository {
  private users: User[] = [];
  private tutors: Tutor[] = [];
  private pets: Pet[] = [];
  private breeds: Breed[] = [];
  private appointments: Appointment[] = [];
  private medicalRecords: MedicalRecord[] = [];
  private financialEntries: FinancialEntry[] = [];
  private stockItems: StockItem[] = [];
  private products: Product[] = [];
  private stockEntries: StockEntry[] = [];
  private estoquesProduto: EstoqueProduto[] = [];
  private estoquesLote: EstoqueLote[] = [];
  private movimentacoesEstoque: MovimentacaoEstoque[] = [];

  async getBootstrap(): Promise<BootstrapPayload> {
    return {
      users: this.users,
      tutors: this.tutors,
      pets: this.pets,
      breeds: this.breeds,
      appointments: this.appointments,
      medicalRecords: this.medicalRecords,
      financialEntries: this.financialEntries,
      stockItems: this.stockItems,
      products: this.products,
      stockEntries: this.stockEntries,
      estoquesProduto: this.estoquesProduto,
      estoquesLote: this.estoquesLote,
      movimentacoesEstoque: this.movimentacoesEstoque,
      summary: calculateSummary(
        this.tutors,
        this.pets,
        this.breeds,
        this.appointments,
        this.financialEntries,
        this.stockItems,
      ),
    };
  }

  async listTutors(): Promise<Tutor[]> {
    return this.tutors;
  }

  async createTutor(input: CreateTutorInput): Promise<Tutor> {
    const tutor: Tutor = {
      id: `t-${Date.now()}`,
      name: input.name,
      phone: input.phone,
      email: input.email,
      address: input.address,
    };

    this.tutors.push(tutor);
    return tutor;
  }

  async listPets(): Promise<Pet[]> {
    return this.pets;
  }

  async createPet(input: CreatePetInput): Promise<Pet> {
    const pet: Pet = {
      id: `p-${Date.now()}`,
      name: input.name,
      species: input.species,
      breedId: input.breedId,
      tutorId: input.tutorId,
      age: input.age,
      weight: input.weight,
      alerts: input.alerts || [],
    };

    this.pets.push(pet);
    return pet;
  }

  async listBreeds(): Promise<Breed[]> {
    return this.breeds;
  }

  async createBreed(input: CreateBreedInput): Promise<Breed> {
    const breed: Breed = {
      id: `b-${Date.now()}`,
      name: input.name,
      species: input.species,
      notes: input.notes || '',
    };

    this.breeds.push(breed);
    return breed;
  }

  async listAppointments(): Promise<Appointment[]> {
    return this.appointments;
  }

  async createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
    const appointment: Appointment = {
      id: `a-${Date.now()}`,
      status: input.status || 'aguardando',
      date: input.date,
      time: input.time,
      tutorName: input.tutorName,
      petName: input.petName,
      veterinarian: input.veterinarian,
      reason: input.reason,
    };

    this.appointments.push(appointment);
    return appointment;
  }

  async listMedicalRecords(): Promise<MedicalRecord[]> {
    return this.medicalRecords;
  }

  async listFinancialEntries(): Promise<FinancialEntry[]> {
    return this.financialEntries;
  }

  async listStockItems(): Promise<StockItem[]> {
    return this.stockItems;
  }

  async listProducts(): Promise<Product[]> {
    return this.products;
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    const now = new Date();
    const product: Product = {
      id: `prod-${Date.now()}`,
      ...input,
      controlaEstoque: input.tipoProduto === 'Servico' ? false : input.controlaEstoque,
      createdAt: now,
      updatedAt: now,
    };

    this.products.push(product);
    if (product.controlaEstoque) {
      this.estoquesProduto.push({
        id: `est-${product.id}`,
        produtoId: product.id,
        quantidadeAtual: 0,
        quantidadeReservada: 0,
        updatedAt: now,
      });
    }

    return product;
  }

  async getProductById(productId: string): Promise<Product | null> {
    return this.products.find((product) => product.id === productId) || null;
  }

  async listProductStocks(): Promise<EstoqueProduto[]> {
    return this.estoquesProduto;
  }

  async getProductStock(productId: string): Promise<EstoqueProduto | null> {
    return this.estoquesProduto.find((stock) => stock.produtoId === productId) || null;
  }

  async createProductStock(productId: string): Promise<EstoqueProduto> {
    const existingStock = await this.getProductStock(productId);

    if (existingStock) {
      return existingStock;
    }

    const stock: EstoqueProduto = {
      id: `est-${productId}`,
      produtoId: productId,
      quantidadeAtual: 0,
      quantidadeReservada: 0,
      updatedAt: new Date(),
    };

    this.estoquesProduto.push(stock);
    return stock;
  }

  async updateProductStock(productId: string, quantidadeAtual: number): Promise<EstoqueProduto> {
    const stock = await this.getProductStock(productId);

    if (!stock) {
      throw new Error('Estoque do produto nao encontrado');
    }

    stock.quantidadeAtual = quantidadeAtual;
    stock.updatedAt = new Date();
    return stock;
  }

  async listStockMovements(): Promise<MovimentacaoEstoque[]> {
    return this.movimentacoesEstoque;
  }

  async createStockMovement(
    input: CreateStockMovementInput & { saldoAnterior: number; saldoPosterior: number },
  ): Promise<MovimentacaoEstoque> {
    const movement: MovimentacaoEstoque = {
      id: `mov-${Date.now()}`,
      produtoId: input.produtoId,
      loteId: input.loteId,
      tipoMovimentacao: input.tipoMovimentacao,
      origem: input.origem,
      quantidade: input.quantidade,
      saldoAnterior: input.saldoAnterior,
      saldoPosterior: input.saldoPosterior,
      custoUnitario: input.custoUnitario,
      valorTotal: input.quantidade * input.custoUnitario,
      usuarioId: input.usuarioId,
      observacao: input.observacao || '',
      documentoReferencia: input.documentoReferencia || '',
      createdAt: new Date(),
    };

    this.movimentacoesEstoque.push(movement);
    return movement;
  }

  async listEstoqueLote(): Promise<EstoqueLote[]> {
    return this.estoquesLote;
  }

  async getEstoqueLoteById(id: string): Promise<EstoqueLote | null> {
    return this.estoquesLote.find(lote => lote.id === id) || null;
  }

  async getEstoqueLoteByProduct(productId: string): Promise<EstoqueLote[]> {
    return this.estoquesLote.filter(lote => lote.produtoId === productId && lote.ativo);
  }

  async createEstoqueLote(input: CreateEstoqueLoteInput): Promise<EstoqueLote> {
    const lote: EstoqueLote = {
      id: `lote-${Date.now()}`,
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.estoquesLote.push(lote);
    return lote;
  }

  async updateEstoqueLote(id: string, quantidadeAtual: number, custoUnitario?: number): Promise<EstoqueLote> {
    const lote = this.estoquesLote.find(l => l.id === id);
    if (!lote) throw new Error('Lote não encontrado');
    
    lote.quantidadeAtual = quantidadeAtual;
    if (custoUnitario !== undefined) lote.custoUnitario = custoUnitario;
    lote.updatedAt = new Date();
    return lote;
  }

  async listStockEntries(): Promise<StockEntry[]> {
    return this.stockEntries;
  }

  async createStockEntry(input: CreateStockEntryInput): Promise<StockEntry> {
    const entry: StockEntry = {
      id: `entry-${Date.now()}`,
      ...input,
      itens: input.itens.map((item, index) => ({
        id: `entry-item-${Date.now()}-${index}`,
        ...item,
      })),
      confirmado: false,
      createdAt: new Date(),
    };

    this.stockEntries.push(entry);
    return entry;
  }

  async confirmStockEntry(entryId: string): Promise<StockEntry> {
    const entry = this.stockEntries.find((item) => item.id === entryId);

    if (!entry) {
      throw new Error('Entrada de estoque nao encontrada');
    }

    if (entry.confirmado) {
      throw new Error('Entrada de estoque ja confirmada');
    }

    entry.confirmado = true;
    return entry;
  }
}

export class MongoClinicRepository implements ClinicRepository {
  async ensureDefaultBreeds(): Promise<void> {
    const breedCount = await BreedModel.countDocuments();

    if (breedCount > 0) {
      return;
    }

    await BreedModel.insertMany(defaultBreeds);
  }

  async getBootstrap(): Promise<BootstrapPayload> {
    const [
      users,
      tutors,
      pets,
      breeds,
      appointments,
      medicalRecords,
      financialEntries,
      stockItems,
      products,
      stockEntries,
      productStocks,
      estoquesLote,
      stockMovements,
    ] =
      await Promise.all([
        UserModel.find().lean(),
        TutorModel.find().lean(),
        PetModel.find().sort({ name: 1 }).lean(),
        BreedModel.find().sort({ species: 1, name: 1 }).lean(),
        AppointmentModel.find().sort({ date: 1, time: 1 }).lean(),
        MedicalRecordModel.find().sort({ date: -1 }).lean(),
        FinancialEntryModel.find().sort({ dueDate: 1 }).lean(),
        StockItemModel.find().sort({ status: 1 }).lean(),
        ProductModel.find().sort({ nome: 1 }).lean(),
        StockEntryModel.find().sort({ createdAt: -1 }).lean(),
        ProductStockModel.find().sort({ produtoId: 1 }).lean(),
        EstoqueLoteModel.find().sort({ produtoId: 1, dataValidade: 1 }).lean(),
        StockMovementModel.find().sort({ createdAt: -1 }).limit(50).lean(),
      ]);

    const typedTutors = usersToPlain<Tutor>(tutors);
    const typedPets = usersToPlain<Pet>(pets);
    const typedBreeds = usersToPlain<Breed>(breeds);
    const typedAppointments = usersToPlain<Appointment>(appointments);
    const typedFinancialEntries = usersToPlain<FinancialEntry>(financialEntries);
    const typedStockItems = usersToPlain<StockItem>(stockItems);
    const typedProducts = usersToPlain<Product>(products);
    const typedStockEntries = usersToPlain<StockEntry>(stockEntries);
    const typedProductStocks = usersToPlain<EstoqueProduto>(productStocks);
    const typedEstoquesLote = usersToPlain<EstoqueLote>(estoquesLote);
    const typedStockMovements = usersToPlain<MovimentacaoEstoque>(stockMovements);

    return {
      users: usersToPlain<User>(users).map(toPublicUser),
      tutors: typedTutors,
      pets: typedPets,
      breeds: typedBreeds,
      appointments: typedAppointments,
      medicalRecords: usersToPlain<MedicalRecord>(medicalRecords),
      financialEntries: typedFinancialEntries,
      stockItems: typedStockItems,
      products: typedProducts,
      stockEntries: typedStockEntries,
      estoquesProduto: typedProductStocks,
      estoquesLote: typedEstoquesLote,
      movimentacoesEstoque: typedStockMovements,
      summary: calculateSummary(
        typedTutors,
        typedPets,
        typedBreeds,
        typedAppointments,
        typedFinancialEntries,
        typedStockItems,
      ),
    };
  }

  async listTutors(): Promise<Tutor[]> {
    return usersToPlain<Tutor>(await TutorModel.find().lean());
  }

  async createTutor(input: CreateTutorInput): Promise<Tutor> {
    const tutor = await TutorModel.create({
      id: `t-${Date.now()}`,
      ...input,
    });

    return tutor.toObject() as Tutor;
  }

  async listPets(): Promise<Pet[]> {
    return usersToPlain<Pet>(await PetModel.find().sort({ name: 1 }).lean());
  }

  async createPet(input: CreatePetInput): Promise<Pet> {
    const pet = await PetModel.create({
      id: `p-${Date.now()}`,
      ...input,
      alerts: input.alerts || [],
    });

    return pet.toObject() as Pet;
  }

  async listBreeds(): Promise<Breed[]> {
    return usersToPlain<Breed>(await BreedModel.find().sort({ species: 1, name: 1 }).lean());
  }

  async createBreed(input: CreateBreedInput): Promise<Breed> {
    const breed = await BreedModel.create({
      id: `b-${Date.now()}`,
      ...input,
      notes: input.notes || '',
    });

    return breed.toObject() as Breed;
  }

  async listAppointments(): Promise<Appointment[]> {
    return usersToPlain<Appointment>(await AppointmentModel.find().sort({ date: 1, time: 1 }).lean());
  }

  async createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
    const appointment = await AppointmentModel.create({
      id: `a-${Date.now()}`,
      status: input.status || 'aguardando',
      ...input,
    });

    return appointment.toObject() as Appointment;
  }

  async listMedicalRecords(): Promise<MedicalRecord[]> {
    return usersToPlain<MedicalRecord>(await MedicalRecordModel.find().sort({ date: -1 }).lean());
  }

  async listFinancialEntries(): Promise<FinancialEntry[]> {
    return usersToPlain<FinancialEntry>(await FinancialEntryModel.find().sort({ dueDate: 1 }).lean());
  }

  async listStockItems(): Promise<StockItem[]> {
    return usersToPlain<StockItem>(await StockItemModel.find().sort({ status: 1 }).lean());
  }

  async listProducts(): Promise<Product[]> {
    return usersToPlain<Product>(await ProductModel.find().sort({ nome: 1 }).lean());
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    const product = await ProductModel.create({
      id: `prod-${Date.now()}`,
      ...input,
      controlaEstoque: input.tipoProduto === 'Servico' ? false : input.controlaEstoque,
    });

    const createdProduct = product.toObject() as Product;

    if (createdProduct.controlaEstoque) {
      await this.createProductStock(createdProduct.id);
    }

    return createdProduct;
  }

  async getProductById(productId: string): Promise<Product | null> {
    return (await ProductModel.findOne({ id: productId }).lean()) as Product | null;
  }

  async listProductStocks(): Promise<EstoqueProduto[]> {
    return usersToPlain<EstoqueProduto>(await ProductStockModel.find().sort({ produtoId: 1 }).lean());
  }

  async getProductStock(productId: string): Promise<EstoqueProduto | null> {
    return (await ProductStockModel.findOne({ produtoId: productId }).lean()) as EstoqueProduto | null;
  }

  async createProductStock(productId: string): Promise<EstoqueProduto> {
    const stock = await ProductStockModel.findOneAndUpdate(
      { produtoId: productId },
      {
        $setOnInsert: {
          id: `est-${productId}`,
          produtoId: productId,
          quantidadeAtual: 0,
          quantidadeReservada: 0,
        },
      },
      { new: true, upsert: true },
    );

    return stock.toObject() as EstoqueProduto;
  }

  async updateProductStock(productId: string, quantidadeAtual: number): Promise<EstoqueProduto> {
    const stock = await ProductStockModel.findOneAndUpdate(
      { produtoId: productId },
      { quantidadeAtual },
      { new: true },
    );

    if (!stock) {
      throw new Error('Estoque do produto nao encontrado');
    }

    return stock.toObject() as EstoqueProduto;
  }

  async listStockMovements(): Promise<MovimentacaoEstoque[]> {
    return usersToPlain<MovimentacaoEstoque>(await StockMovementModel.find().sort({ createdAt: -1 }).lean());
  }

  async createStockMovement(
    input: CreateStockMovementInput & { saldoAnterior: number; saldoPosterior: number },
  ): Promise<MovimentacaoEstoque> {
    const movement = await StockMovementModel.create({
      id: `mov-${Date.now()}`,
      ...input,
      valorTotal: input.quantidade * input.custoUnitario,
    });

    return movement.toObject() as MovimentacaoEstoque;
  }

  async listEstoqueLote(): Promise<EstoqueLote[]> {
    return usersToPlain<EstoqueLote>(
      await EstoqueLoteModel.find().sort({ produtoId: 1, dataValidade: 1 }).lean(),
    );
  }

  async getEstoqueLoteById(id: string): Promise<EstoqueLote | null> {
    return (await EstoqueLoteModel.findOne({ id }).lean()) as EstoqueLote | null;
  }

  async getEstoqueLoteByProduct(productId: string): Promise<EstoqueLote[]> {
    return usersToPlain<EstoqueLote>(
      await EstoqueLoteModel.find({ produtoId: productId, ativo: true }).sort({ dataValidade: 1 }).lean(),
    );
  }

  async createEstoqueLote(input: CreateEstoqueLoteInput): Promise<EstoqueLote> {
    const lote = await EstoqueLoteModel.create({
      id: `lote-${Date.now()}`,
      ...input,
    });

    return lote.toObject() as EstoqueLote;
  }

  async updateEstoqueLote(id: string, quantidadeAtual: number, custoUnitario?: number): Promise<EstoqueLote> {
    const update: { quantidadeAtual: number; custoUnitario?: number } = { quantidadeAtual };

    if (custoUnitario !== undefined) {
      update.custoUnitario = custoUnitario;
    }

    const lote = await EstoqueLoteModel.findOneAndUpdate({ id }, update, { new: true });

    if (!lote) {
      throw new Error('Lote nao encontrado');
    }

    return lote.toObject() as EstoqueLote;
  }

  async listStockEntries(): Promise<StockEntry[]> {
    return usersToPlain<StockEntry>(await StockEntryModel.find().sort({ createdAt: -1 }).lean());
  }

  async createStockEntry(input: CreateStockEntryInput): Promise<StockEntry> {
    const entry = await StockEntryModel.create({
      id: `entry-${Date.now()}`,
      ...input,
      itens: input.itens.map((item, index) => ({
        id: `entry-item-${Date.now()}-${index}`,
        ...item,
      })),
      confirmado: false,
    });

    return entry.toObject() as StockEntry;
  }

  async confirmStockEntry(entryId: string): Promise<StockEntry> {
    const entry = await StockEntryModel.findOne({ id: entryId });

    if (!entry) {
      throw new Error('Entrada de estoque nao encontrada');
    }

    if (entry.confirmado) {
      throw new Error('Entrada de estoque ja confirmada');
    }

    entry.confirmado = true;
    await entry.save();

    return entry.toObject() as StockEntry;
  }

}

function usersToPlain<T>(documents: unknown): T[] {
  return JSON.parse(JSON.stringify(documents)) as T[];
}
