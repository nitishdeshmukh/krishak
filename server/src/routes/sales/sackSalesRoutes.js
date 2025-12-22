import { Router } from 'express';
import { getSackSales, getSackSaleById, createSackSale, updateSackSale, deleteSackSale } from '../../controllers/sales/sackSalesController.js';
const router = Router();
router.route('/').get(getSackSales).post(createSackSale);
router.route('/:id').get(getSackSaleById).put(updateSackSale).delete(deleteSackSale);
export default router;
