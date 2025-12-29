/**
 * DO Entries Routes
 */
import { Router } from 'express';
import { getDOEntries, getAllDOEntries, getDOEntryByNumber, getDOEntryById, createDOEntry, createBulkDOEntries, updateDOEntry, deleteDOEntry } from '../controllers/doEntriesController.js';

const router = Router();

router.route('/bulk').post(createBulkDOEntries);
router.route('/all').get(getAllDOEntries);
router.route('/by-number/:doNumber').get(getDOEntryByNumber);
router.route('/').get(getDOEntries).post(createDOEntry);
router.route('/:id').get(getDOEntryById).put(updateDOEntry).delete(deleteDOEntry);

export default router;
