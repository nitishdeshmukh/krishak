/**
 * DO Entries Routes
 */
import { Router } from 'express';
import { getDOEntries, getDOEntryById, createDOEntry, createBulkDOEntries, updateDOEntry, deleteDOEntry } from '../controllers/doEntriesController.js';

const router = Router();

router.route('/bulk').post(createBulkDOEntries);
router.route('/').get(getDOEntries).post(createDOEntry);
router.route('/:id').get(getDOEntryById).put(updateDOEntry).delete(deleteDOEntry);

export default router;
