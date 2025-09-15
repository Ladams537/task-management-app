import express from 'express';
import { getAllTasksForList, createTask } from '../controllers/taskController.js';

// This router will be mounted under /api/lists
const router = express.Router({ mergeParams: true });

// Matches GET /api/list/:listId
router.get('/', getAllTasksForList);

// Matches POST /api/list/:listId
router.post('/', createTask);

export default router;