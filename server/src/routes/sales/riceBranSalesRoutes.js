import { Router } from 'express';
import { getRiceBranSales, getRiceBranSaleById, createRiceBranSale, updateRiceBranSale, deleteRiceBranSale } from '../../controllers/sales/riceBranSalesController.js';
const router = Router();
router.route('/').get(getRiceBranSales).post(createRiceBranSale);
router.route('/:id').get(getRiceBranSaleById).put(updateRiceBranSale).delete(deleteRiceBranSale);
export default router;
