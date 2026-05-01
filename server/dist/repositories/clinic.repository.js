"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoClinicRepository = exports.MemoryClinicRepository = void 0;
const seed_1 = require("../data/seed");
const clinic_models_1 = require("../models/clinic.models");
const auth_repository_1 = require("./auth.repository");
function calculateSummary(tutors, pets, breeds, appointments, financialEntries, stockItems) {
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
        appointmentsToday: appointments.filter((appointment) => appointment.date === '2026-05-01').length,
        lowStock: stockItems.filter((item) => item.status !== 'ok').length,
        cashBalance: receivables - payables,
    };
}
function clone(value) {
    return JSON.parse(JSON.stringify(value));
}
class MemoryClinicRepository {
    users = clone(seed_1.usersSeed);
    tutors = clone(seed_1.tutorsSeed);
    pets = clone(seed_1.petsSeed);
    breeds = clone(seed_1.breedsSeed);
    appointments = clone(seed_1.appointmentsSeed);
    medicalRecords = clone(seed_1.medicalRecordsSeed);
    financialEntries = clone(seed_1.financialEntriesSeed);
    stockItems = clone(seed_1.stockItemsSeed);
    products = clone(seed_1.productsSeed);
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
        return product;
    }
}
exports.MemoryClinicRepository = MemoryClinicRepository;
class MongoClinicRepository {
    async seedIfEmpty() {
        const [userCount, tutorCount, breedCount, petCount, appointmentCount, recordCount, financialCount, stockCount, productCount,] = await Promise.all([
            clinic_models_1.UserModel.countDocuments(),
            clinic_models_1.TutorModel.countDocuments(),
            clinic_models_1.BreedModel.countDocuments(),
            clinic_models_1.PetModel.countDocuments(),
            clinic_models_1.AppointmentModel.countDocuments(),
            clinic_models_1.MedicalRecordModel.countDocuments(),
            clinic_models_1.FinancialEntryModel.countDocuments(),
            clinic_models_1.StockItemModel.countDocuments(),
            clinic_models_1.ProductModel.countDocuments(),
        ]);
        await Promise.all([
            userCount === 0 ? clinic_models_1.UserModel.insertMany(seed_1.usersSeed) : Promise.resolve(),
            tutorCount === 0 ? clinic_models_1.TutorModel.insertMany(seed_1.tutorsSeed) : Promise.resolve(),
            breedCount === 0 ? clinic_models_1.BreedModel.insertMany(seed_1.breedsSeed) : Promise.resolve(),
            petCount === 0 ? clinic_models_1.PetModel.insertMany(seed_1.petsSeed) : Promise.resolve(),
            appointmentCount === 0 ? clinic_models_1.AppointmentModel.insertMany(seed_1.appointmentsSeed) : Promise.resolve(),
            recordCount === 0 ? clinic_models_1.MedicalRecordModel.insertMany(seed_1.medicalRecordsSeed) : Promise.resolve(),
            financialCount === 0 ? clinic_models_1.FinancialEntryModel.insertMany(seed_1.financialEntriesSeed) : Promise.resolve(),
            stockCount === 0 ? clinic_models_1.StockItemModel.insertMany(seed_1.stockItemsSeed) : Promise.resolve(),
            productCount === 0 ? clinic_models_1.ProductModel.insertMany(seed_1.productsSeed) : Promise.resolve(),
        ]);
    }
    async getBootstrap() {
        const [users, tutors, pets, breeds, appointments, medicalRecords, financialEntries, stockItems, products] = await Promise.all([
            clinic_models_1.UserModel.find().lean(),
            clinic_models_1.TutorModel.find().lean(),
            clinic_models_1.PetModel.find().sort({ name: 1 }).lean(),
            clinic_models_1.BreedModel.find().sort({ species: 1, name: 1 }).lean(),
            clinic_models_1.AppointmentModel.find().sort({ date: 1, time: 1 }).lean(),
            clinic_models_1.MedicalRecordModel.find().sort({ date: -1 }).lean(),
            clinic_models_1.FinancialEntryModel.find().sort({ dueDate: 1 }).lean(),
            clinic_models_1.StockItemModel.find().sort({ status: 1 }).lean(),
            clinic_models_1.ProductModel.find().sort({ nome: 1 }).lean(),
        ]);
        const typedTutors = usersToPlain(tutors);
        const typedPets = usersToPlain(pets);
        const typedBreeds = usersToPlain(breeds);
        const typedAppointments = usersToPlain(appointments);
        const typedFinancialEntries = usersToPlain(financialEntries);
        const typedStockItems = usersToPlain(stockItems);
        const typedProducts = usersToPlain(products);
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
        return product.toObject();
    }
}
exports.MongoClinicRepository = MongoClinicRepository;
function usersToPlain(documents) {
    return JSON.parse(JSON.stringify(documents));
}
