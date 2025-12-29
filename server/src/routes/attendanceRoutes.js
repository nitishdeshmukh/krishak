import express from 'express';
import {
    bulkCreateAttendance,
    getAttendanceByDate,
    getAttendanceReport,
    deleteAttendance
} from '../controllers/attendanceController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect); // All routes protected

router.route('/')
    .get(getAttendanceReport);

router.route('/bulk')
    .post(bulkCreateAttendance);

router.route('/by-date')
    .get(getAttendanceByDate);

router.route('/:id')
    .delete(deleteAttendance);

export default router;
