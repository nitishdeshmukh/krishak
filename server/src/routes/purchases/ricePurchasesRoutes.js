import { Router } from 'express';
import { getRicePurchases, getRicePurchaseById, createRicePurchase, updateRicePurchase, deleteRicePurchase } from '../../controllers/purchases/ricePurchasesController.js';

const router = Router();
router.route('/').get(getRicePurchases).post(createRicePurchase);
router.route('/:id').get(getRicePurchaseById).put(updateRicePurchase).delete(deleteRicePurchase);
export default router;
