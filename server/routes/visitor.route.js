import express from 'express';

import {
	createVisitor,
	deleteVisitor,
	getVisitorById,
	getVisitors,
	updateVisitorStatus,
} from '#controllers/visitor.controller.js';

import { admin, protect } from '#middlewares/auth.middleware.js';

const router = express.Router();

router.route('/').post(protect, createVisitor).get(protect, getVisitors);

router.route('/:id/status').put(protect, updateVisitorStatus);

router
	.route('/:id')
	.delete(protect, admin, deleteVisitor)
	.get(protect, getVisitorById);

export default router;