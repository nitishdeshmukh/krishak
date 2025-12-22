import { Router } from 'express';
import { getPaddyPurchases, getPaddyPurchaseById, createPaddyPurchase, updatePaddyPurchase, deletePaddyPurchase } from '../../controllers/purchases/paddyPurchasesController.js';

const router = Router();
router.route('/').get(getPaddyPurchases).post(createPaddyPurchase);
router.route('/:id').get(getPaddyPurchaseById).put(updatePaddyPurchase).delete(deletePaddyPurchase);
export default router;
