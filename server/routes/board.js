import express from 'express';
import { getAllLists, createList, updateList, deleteList } from '../controllers/boardController.js';

const router = express.Router({ mergeParams: true });

// Define the route to get all lists for a specific board
// GET /api/board/:boardId
router.get('/', getAllLists);

// Define the route to create a new list for a specific board
// POST /api/board/:boardId
router.post('/', createList);

// Define the route to update a specific list
// PUT /api/board/:boardId/:listId
router.put('/:listId', updateList);

// Define the route to delete a specific list
// DELETE /api/board/:boardId/:listId
router.delete('/:listId', deleteList);

export default router;
