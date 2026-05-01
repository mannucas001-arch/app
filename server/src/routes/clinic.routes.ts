import { Router } from 'express';
import type { ClinicController } from '../controllers/clinic.controller';

export function createClinicRouter(controller: ClinicController) {
  const router = Router();

  router.get('/health', controller.getHealth);
  router.get('/bootstrap', controller.getBootstrap);
  router.get('/tutors', controller.listTutors);
  router.post('/tutors', controller.createTutor);
  router.get('/pets', controller.listPets);
  router.post('/pets', controller.createPet);
  router.get('/breeds', controller.listBreeds);
  router.post('/breeds', controller.createBreed);
  router.get('/appointments', controller.listAppointments);
  router.post('/appointments', controller.createAppointment);
  router.get('/medical-records', controller.listMedicalRecords);
  router.get('/financial-entries', controller.listFinancialEntries);
  router.get('/stock-items', controller.listStockItems);
  router.get('/products', controller.listProducts);
  router.post('/products', controller.createProduct);
  router.get('/product-stocks', controller.listProductStocks);
  router.get('/stock-movements', controller.listStockMovements);
  router.post('/stock-movements', controller.createStockMovement);

  return router;
}
