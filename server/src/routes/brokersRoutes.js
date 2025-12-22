/**
 * Brokers Routes
 */
import { Router } from 'express';
import { getBrokers, getBrokerById, createBroker, updateBroker, deleteBroker } from '../controllers/brokersController.js';

const router = Router();

router.route('/').get(getBrokers).post(createBroker);
router.route('/:id').get(getBrokerById).put(updateBroker).delete(deleteBroker);

export default router;
