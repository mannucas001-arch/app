"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoClinicRepository = exports.MemoryClinicRepository = void 0;
const default_breeds_1 = require("../data/default-breeds");
const clinic_models_1 = require("../models/clinic.models");
const auth_repository_1 = require("./auth.repository");
function calculateSummary(tutors, pets, breeds, appointments, financialEntries, stockItems) {
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
function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
class MemoryClinicRepository {
    users = [];
    tutors = [];
    pets = [];
    breeds = [];
    appointments = [];
    medicalRecords = [];
    financialEntries = [];
    stockItems = [];
    products = [];
    stockEntries = [];
    estoquesProduto = [];
    estoquesLote = [];
    movimentacoesEstoque = [];
    async getBootstrap() {
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
            summary: calculateSummary(this.tutors, this.pets, this.breeds, this.appointments, this.financialEntries, this.stockItems),
        };
    }
    async listTutors() {
        return this.tutors;
    }
    async createTutor(input) {
        const tutor = {
            id: `t-${Date.now()}`,
            name: input.name,
            phone: input.phone,
            email: input.email,
            address: input.address,
        };
        this.tutors.push(tutor);
        return tutor;
    }
    async listPets() {
        return this.pets;
    }
    async createPet(input) {
        const pet = {
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
    async listBreeds() {
        return this.breeds;
    }
    async createBreed(input) {
        const breed = {
            id: `b-${Date.now()}`,
            name: input.name,
            species: input.species,
            notes: input.notes || '',
        };
        this.breeds.push(breed);
        return breed;
    }
    async listAppointments() {
        return this.appointments;
    }
    async createAppointment(input) {
        const appointment = {
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
    async listMedicalRecords() {
        return this.medicalRecords;
    }
    async listFinancialEntries() {
        return this.financialEntries;
    }
    async listStockItems() {
        return this.stockItems;
    }
    async listProducts() {
        return this.products;
    }
    async createProduct(input) {
        const now = new Date();
        const product = {
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
    async getProductById(productId) {
        return this.products.find((product) => product.id === productId) || null;
    }
    async listProductStocks() {
        return this.estoquesProduto;
    }
    async getProductStock(productId) {
        return this.estoquesProduto.find((stock) => stock.produtoId === productId) || null;
    }
    async createProductStock(productId) {
        const existingStock = await this.getProductStock(productId);
        if (existingStock) {
            return existingStock;
        }
        const stock = {
            id: `est-${productId}`,
            produtoId: productId,
            quantidadeAtual: 0,
            quantidadeReservada: 0,
            updatedAt: new Date(),
        };
        this.estoquesProduto.push(stock);
        return stock;
    }
    async updateProductStock(productId, quantidadeAtual) {
        const stock = await this.getProductStock(productId);
        if (!stock) {
            throw new Error('Estoque do produto nao encontrado');
        }
        stock.quantidadeAtual = quantidadeAtual;
        stock.updatedAt = new Date();
        return stock;
    }
    async listStockMovements() {
        return this.movimentacoesEstoque;
    }
    async createStockMovement(input) {
        const movement = {
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
    async listEstoqueLote() {
        return this.estoquesLote;
    }
    async getEstoqueLoteById(id) {
        return this.estoquesLote.find(lote => lote.id === id) || null;
    }
    async getEstoqueLoteByProduct(productId) {
        return this.estoquesLote.filter(lote => lote.produtoId === productId && lote.ativo);
    }
    async createEstoqueLote(input) {
        const lote = {
            id: `lote-${Date.now()}`,
            ...input,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.estoquesLote.push(lote);
        return lote;
    }
    async updateEstoqueLote(id, quantidadeAtual, custoUnitario) {
        const lote = this.estoquesLote.find(l => l.id === id);
        if (!lote)
            throw new Error('Lote não encontrado');
        lote.quantidadeAtual = quantidadeAtual;
        if (custoUnitario !== undefined)
            lote.custoUnitario = custoUnitario;
        lote.updatedAt = new Date();
        return lote;
    }
    async listStockEntries() {
        return this.stockEntries;
    }
    async createStockEntry(input) {
        const entry = {
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
    async confirmStockEntry(entryId) {
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
exports.MemoryClinicRepository = MemoryClinicRepository;
class MongoClinicRepository {
    async ensureDefaultBreeds() {
        const breedCount = await clinic_models_1.BreedModel.countDocuments();
        if (breedCount > 0) {
            return;
        }
        await clinic_models_1.BreedModel.insertMany(default_breeds_1.defaultBreeds);
    }
    async getBootstrap() {
        const [users, tutors, pets, breeds, appointments, medicalRecords, financialEntries, stockItems, products, stockEntries, productStocks, estoquesLote, stockMovements,] = await Promise.all([
            clinic_models_1.UserModel.find().lean(),
            clinic_models_1.TutorModel.find().lean(),
            clinic_models_1.PetModel.find().sort({ name: 1 }).lean(),
            clinic_models_1.BreedModel.find().sort({ species: 1, name: 1 }).lean(),
            clinic_models_1.AppointmentModel.find().sort({ date: 1, time: 1 }).lean(),
            clinic_models_1.MedicalRecordModel.find().sort({ date: -1 }).lean(),
            clinic_models_1.FinancialEntryModel.find().sort({ dueDate: 1 }).lean(),
            clinic_models_1.StockItemModel.find().sort({ status: 1 }).lean(),
            clinic_models_1.ProductModel.find().sort({ nome: 1 }).lean(),
            clinic_models_1.StockEntryModel.find().sort({ createdAt: -1 }).lean(),
            clinic_models_1.ProductStockModel.find().sort({ produtoId: 1 }).lean(),
            clinic_models_1.EstoqueLoteModel.find().sort({ produtoId: 1, dataValidade: 1 }).lean(),
            clinic_models_1.StockMovementModel.find().sort({ createdAt: -1 }).limit(50).lean(),
        ]);
        const typedTutors = usersToPlain(tutors);
        const typedPets = usersToPlain(pets);
        const typedBreeds = usersToPlain(breeds);
        const typedAppointments = usersToPlain(appointments);
        const typedFinancialEntries = usersToPlain(financialEntries);
        const typedStockItems = usersToPlain(stockItems);
        const typedProducts = usersToPlain(products);
        const typedStockEntries = usersToPlain(stockEntries);
        const typedProductStocks = usersToPlain(productStocks);
        const typedEstoquesLote = usersToPlain(estoquesLote);
        const typedStockMovements = usersToPlain(stockMovements);
        return {
            users: usersToPlain(users).map(auth_repository_1.toPublicUser),
            tutors: typedTutors,
            pets: typedPets,
            breeds: typedBreeds,
            appointments: typedAppointments,
            medicalRecords: usersToPlain(medicalRecords),
            financialEntries: typedFinancialEntries,
            stockItems: typedStockItems,
            products: typedProducts,
            stockEntries: typedStockEntries,
            estoquesProduto: typedProductStocks,
            estoquesLote: typedEstoquesLote,
            movimentacoesEstoque: typedStockMovements,
            summary: calculateSummary(typedTutors, typedPets, typedBreeds, typedAppointments, typedFinancialEntries, typedStockItems),
        };
    }
    async listTutors() {
        return usersToPlain(await clinic_models_1.TutorModel.find().lean());
    }
    async createTutor(input) {
        const tutor = await clinic_models_1.TutorModel.create({
            id: `t-${Date.now()}`,
            ...input,
        });
        return tutor.toObject();
    }
    async listPets() {
        return usersToPlain(await clinic_models_1.PetModel.find().sort({ name: 1 }).lean());
    }
    async createPet(input) {
        const pet = await clinic_models_1.PetModel.create({
            id: `p-${Date.now()}`,
            ...input,
            alerts: input.alerts || [],
        });
        return pet.toObject();
    }
    async listBreeds() {
        return usersToPlain(await clinic_models_1.BreedModel.find().sort({ species: 1, name: 1 }).lean());
    }
    async createBreed(input) {
        const breed = await clinic_models_1.BreedModel.create({
            id: `b-${Date.now()}`,
            ...input,
            notes: input.notes || '',
        });
        return breed.toObject();
    }
    async listAppointments() {
        return usersToPlain(await clinic_models_1.AppointmentModel.find().sort({ date: 1, time: 1 }).lean());
    }
    async createAppointment(input) {
        const appointment = await clinic_models_1.AppointmentModel.create({
            id: `a-${Date.now()}`,
            status: input.status || 'aguardando',
            ...input,
        });
        return appointment.toObject();
    }
    async listMedicalRecords() {
        return usersToPlain(await clinic_models_1.MedicalRecordModel.find().sort({ date: -1 }).lean());
    }
    async listFinancialEntries() {
        return usersToPlain(await clinic_models_1.FinancialEntryModel.find().sort({ dueDate: 1 }).lean());
    }
    async listStockItems() {
        return usersToPlain(await clinic_models_1.StockItemModel.find().sort({ status: 1 }).lean());
    }
    async listProducts() {
        return usersToPlain(await clinic_models_1.ProductModel.find().sort({ nome: 1 }).lean());
    }
    async createProduct(input) {
        const product = await clinic_models_1.ProductModel.create({
            id: `prod-${Date.now()}`,
            ...input,
            controlaEstoque: input.tipoProduto === 'Servico' ? false : input.controlaEstoque,
        });
        const createdProduct = product.toObject();
        if (createdProduct.controlaEstoque) {
            await this.createProductStock(createdProduct.id);
        }
        return createdProduct;
    }
    async getProductById(productId) {
        return (await clinic_models_1.ProductModel.findOne({ id: productId }).lean());
    }
    async listProductStocks() {
        return usersToPlain(await clinic_models_1.ProductStockModel.find().sort({ produtoId: 1 }).lean());
    }
    async getProductStock(productId) {
        return (await clinic_models_1.ProductStockModel.findOne({ produtoId: productId }).lean());
    }
    async createProductStock(productId) {
        const stock = await clinic_models_1.ProductStockModel.findOneAndUpdate({ produtoId: productId }, {
            $setOnInsert: {
                id: `est-${productId}`,
                produtoId: productId,
                quantidadeAtual: 0,
                quantidadeReservada: 0,
            },
        }, { new: true, upsert: true });
        return stock.toObject();
    }
    async updateProductStock(productId, quantidadeAtual) {
        const stock = await clinic_models_1.ProductStockModel.findOneAndUpdate({ produtoId: productId }, { quantidadeAtual }, { new: true });
        if (!stock) {
            throw new Error('Estoque do produto nao encontrado');
        }
        return stock.toObject();
    }
    async listStockMovements() {
        return usersToPlain(await clinic_models_1.StockMovementModel.find().sort({ createdAt: -1 }).lean());
    }
    async createStockMovement(input) {
        const movement = await clinic_models_1.StockMovementModel.create({
            id: `mov-${Date.now()}`,
            ...input,
            valorTotal: input.quantidade * input.custoUnitario,
        });
        return movement.toObject();
    }
    async listEstoqueLote() {
        return usersToPlain(await clinic_models_1.EstoqueLoteModel.find().sort({ produtoId: 1, dataValidade: 1 }).lean());
    }
    async getEstoqueLoteById(id) {
        return (await clinic_models_1.EstoqueLoteModel.findOne({ id }).lean());
    }
    async getEstoqueLoteByProduct(productId) {
        return usersToPlain(await clinic_models_1.EstoqueLoteModel.find({ produtoId: productId, ativo: true }).sort({ dataValidade: 1 }).lean());
    }
    async createEstoqueLote(input) {
        const lote = await clinic_models_1.EstoqueLoteModel.create({
            id: `lote-${Date.now()}`,
            ...input,
        });
        return lote.toObject();
    }
    async updateEstoqueLote(id, quantidadeAtual, custoUnitario) {
        const update = { quantidadeAtual };
        if (custoUnitario !== undefined) {
            update.custoUnitario = custoUnitario;
        }
        const lote = await clinic_models_1.EstoqueLoteModel.findOneAndUpdate({ id }, update, { new: true });
        if (!lote) {
            throw new Error('Lote nao encontrado');
        }
        return lote.toObject();
    }
    async listStockEntries() {
        return usersToPlain(await clinic_models_1.StockEntryModel.find().sort({ createdAt: -1 }).lean());
    }
    async createStockEntry(input) {
        const entry = await clinic_models_1.StockEntryModel.create({
            id: `entry-${Date.now()}`,
            ...input,
            itens: input.itens.map((item, index) => ({
                id: `entry-item-${Date.now()}-${index}`,
                ...item,
            })),
            confirmado: false,
        });
        return entry.toObject();
    }
    async confirmStockEntry(entryId) {
        const entry = await clinic_models_1.StockEntryModel.findOne({ id: entryId });
        if (!entry) {
            throw new Error('Entrada de estoque nao encontrada');
        }
        if (entry.confirmado) {
            throw new Error('Entrada de estoque ja confirmada');
        }
        entry.confirmado = true;
        await entry.save();
        return entry.toObject();
    }
}
exports.MongoClinicRepository = MongoClinicRepository;
function usersToPlain(documents) {
    return JSON.parse(JSON.stringify(documents));
}
