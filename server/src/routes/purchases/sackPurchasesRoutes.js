import { Router } from 'express';
import { getSackPurchases, getSackPurchaseById, createSackPurchase, updateSackPurchase, deleteSackPurchase } from '../../controllers/purchases/sackPurchasesController.js';

const router = Router();
router.route('/').get(getSackPurchases).post(createSackPurchase);
router.route('/:id').get(getSackPurchaseById).put(updateSackPurchase).delete(deleteSackPurchase);
export default router;
