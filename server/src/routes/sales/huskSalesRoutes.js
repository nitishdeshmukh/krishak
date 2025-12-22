import { Router } from 'express';
import { getHuskSales, getHuskSaleById, createHuskSale, updateHuskSale, deleteHuskSale } from '../../controllers/sales/huskSalesController.js';
const router = Router();
router.route('/').get(getHuskSales).post(createHuskSale);
router.route('/:id').get(getHuskSaleById).put(updateHuskSale).delete(deleteHuskSale);
export default router;
