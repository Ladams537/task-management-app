import express from 'express';
import { getAllBoards, createBoard } from '../controllers/dashboardController.js';

const router = express.Router();

// Define the route to get all boards
// GET /api/dashboard/
router.get('/', getAllBoards);

// Define the route to create a new board
// POST /api/dashboard/
router.post('/', createBoard);

// We will add more routes here later (e.g., POST for creating a board)

export default router;
