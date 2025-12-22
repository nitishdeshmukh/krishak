/**
 * Parties Routes
 */
import { Router } from 'express';
import { getParties, getPartyById, createParty, updateParty, deleteParty } from '../controllers/partiesController.js';

const router = Router();

router.route('/').get(getParties).post(createParty);
router.route('/:id').get(getPartyById).put(updateParty).delete(deleteParty);

export default router;
