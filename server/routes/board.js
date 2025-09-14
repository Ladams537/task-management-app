import express from 'express';
import { getAllLists, createList, updateList, deleteList } from '../controllers/boardController.js';

const router = express.Router({ mergeParams: true });

// Define the route to get all lists for a specific board
// GET /api/board/:boardId/lists
router.get('/:boardId/lists', getAllLists);

// Define the route to create a new list for a specific board
// POST /api/board/:boardId/lists
router.post('/:boardId/lists', createList);

// Define the route to update a specific list
// PUT /api/board/:boardId/:listId
router.put('/:boardId/:listId', updateList);

// Define the route to delete a specific list
// DELETE /api/board/:boardId/:listId
router.delete('/:boardId/:listId', deleteList);

export default router;
