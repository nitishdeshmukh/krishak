import { Router } from 'express';
import { getRiceSales, getRiceSaleById, createRiceSale, updateRiceSale, deleteRiceSale } from '../../controllers/sales/riceSalesController.js';
const router = Router();
router.route('/').get(getRiceSales).post(createRiceSale);
router.route('/:id').get(getRiceSaleById).put(updateRiceSale).delete(deleteRiceSale);
export default router;
