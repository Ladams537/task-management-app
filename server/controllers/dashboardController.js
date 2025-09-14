import { query } from '../db/index.js';

// GET /api/boards
// Get all boards from the database
export const getAllBoards = async (req, res) => {
	try {
		const { rows } = await query('SELECT * FROM boards', []);
		res.status(200).json(rows);
	} catch (error) {
		console.error('Error fetching boards:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

// POST /api/boards
// Create a new board
export const createBoard = async (req, res) => {
	// We'll get the name and description from the request body
	const { name, description } = req.body;

	// Basic validation
	if (!name) {
		return res.status(400).json({ error: 'Board name is required.' });
	}

	try {
		const sql = 'INSERT INTO boards (name, description, owner_id) '
		+ 'VALUES ($1, $2, $3) RETURNING *';
		// We'll hardcode owner_id to 1 for now, until we have user accounts.
		const params = [name, description || null, 1];

		const { rows } = await query(sql, params);
		const newBoard = rows[0];

		// Emit the new board to all connected clients
		req.io.emit('board:created', newBoard);

		// Respond with the newly created board
		res.status(201).json(newBoard);
	} catch (error) {
		console.error('Error creating board:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
