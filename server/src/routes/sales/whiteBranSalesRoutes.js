import { Router } from 'express';
import { getWhiteBranSales, getWhiteBranSaleById, createWhiteBranSale, updateWhiteBranSale, deleteWhiteBranSale } from '../../controllers/sales/whiteBranSalesController.js';
const router = Router();
router.route('/').get(getWhiteBranSales).post(createWhiteBranSale);
router.route('/:id').get(getWhiteBranSaleById).put(updateWhiteBranSale).delete(deleteWhiteBranSale);
export default router;
