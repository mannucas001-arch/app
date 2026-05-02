"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicController = void 0;
class ClinicController {
    service;
    constructor(service) {
        this.service = service;
    }
    getHealth = (_req, res) => {
        res.json({ status: 'ok', message: 'API is running' });
    };
    getBootstrap = async (_req, res, next) => {
        try {
            res.json(await this.service.getBootstrap());
        }
        catch (error) {
            next(error);
        }
    };
    listTutors = async (_req, res, next) => {
        try {
            res.json(await this.service.listTutors());
        }
        catch (error) {
            next(error);
        }
    };
    createTutor = async (req, res, next) => {
        try {
            res.status(201).json(await this.service.createTutor(req.body));
        }
        catch (error) {
            next(error);
        }
    };
    listPets = async (_req, res, next) => {
        try {
            res.json(await this.service.listPets());
        }
        catch (error) {
            next(error);
        }
    };
    createPet = async (req, res, next) => {
        try {
            res.status(201).json(await this.service.createPet(req.body));
        }
        catch (error) {
            next(error);
        }
    };
    listBreeds = async (_req, res, next) => {
        try {
            res.json(await this.service.listBreeds());
        }
        catch (error) {
            next(error);
        }
    };
    createBreed = async (req, res, next) => {
        try {
            res.status(201).json(await this.service.createBreed(req.body));
        }
        catch (error) {
            next(error);
        }
    };
    listAppointments = async (_req, res, next) => {
        try {
            res.json(await this.service.listAppointments());
        }
        catch (error) {
            next(error);
        }
    };
    createAppointment = async (req, res, next) => {
        try {
            res.status(201).json(await this.service.createAppointment(req.body));
        }
        catch (error) {
            next(error);
        }
    };
    listMedicalRecords = async (_req, res, next) => {
        try {
            res.json(await this.service.listMedicalRecords());
        }
        catch (error) {
            next(error);
        }
    };
    listFinancialEntries = async (_req, res, next) => {
        try {
            res.json(await this.service.listFinancialEntries());
        }
        catch (error) {
            next(error);
        }
    };
    listStockItems = async (_req, res, next) => {
        try {
            res.json(await this.service.listStockItems());
        }
        catch (error) {
            next(error);
        }
    };
    listProducts = async (_req, res, next) => {
        try {
            res.json(await this.service.listProducts());
        }
        catch (error) {
            next(error);
        }
    };
    createProduct = async (req, res, next) => {
        try {
            res.status(201).json(await this.service.createProduct(req.body));
        }
        catch (error) {
            next(error);
        }
    };
    listProductStocks = async (_req, res, next) => {
        try {
            res.json(await this.service.listProductStocks());
        }
        catch (error) {
            next(error);
        }
    };
    listStockMovements = async (_req, res, next) => {
        try {
            res.json(await this.service.listStockMovements());
        }
        catch (error) {
            next(error);
        }
    };
    createStockMovement = async (req, res, next) => {
        try {
            const user = req.user;
            res.status(201).json(await this.service.createStockMovement(req.body, user?.id));
        }
        catch (error) {
            next(error);
        }
    };
}
exports.ClinicController = ClinicController;
