import { Router } from 'express';
import { getFrkPurchases, getFrkPurchaseById, createFrkPurchase, updateFrkPurchase, deleteFrkPurchase } from '../../controllers/purchases/frkPurchasesController.js';

const router = Router();
router.route('/').get(getFrkPurchases).post(createFrkPurchase);
router.route('/:id').get(getFrkPurchaseById).put(updateFrkPurchase).delete(deleteFrkPurchase);
export default router;
