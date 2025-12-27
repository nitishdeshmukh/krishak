import { Router } from 'express';
import { getPaddyPurchases, getAllPaddyPurchases, getPaddyPurchaseById, createPaddyPurchase, updatePaddyPurchase, deletePaddyPurchase } from '../../controllers/purchases/paddyPurchasesController.js';

const router = Router();
router.route('/').get(getPaddyPurchases).post(createPaddyPurchase);
router.get('/all', getAllPaddyPurchases);
router.route('/:id').get(getPaddyPurchaseById).put(updatePaddyPurchase).delete(deletePaddyPurchase);
export default router;
