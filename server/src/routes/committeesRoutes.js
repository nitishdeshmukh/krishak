/**
 * Committees Routes
 */
import { Router } from 'express';
import { getCommittees, getCommitteeById, createCommittee, updateCommittee, deleteCommittee, getDistinctCommittees, createBulkCommittees } from '../controllers/committeesController.js';

const router = Router();

router.route('/').get(getCommittees).post(createCommittee);
router.route('/distinct').get(getDistinctCommittees);
router.route('/bulk').post(createBulkCommittees);
router.route('/:id').get(getCommitteeById).put(updateCommittee).delete(deleteCommittee);

export default router;
