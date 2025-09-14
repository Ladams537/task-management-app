import { query } from '../db/index.js';

// GET /api/boards/:boardId/lists
// Get all lists for a specific board
export const getAllLists = async (req, res) => {
    try {
        const { boardId } = req.params;
        // Corrected SQL query with a space and sorted by position
        const { rows } = await query(
            'SELECT * FROM lists WHERE board_id = $1 ORDER BY position ASC',
            [boardId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching lists:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// POST /api/boards/:boardId/lists
// Create a new list for a specific board
export const createList = async (req, res) => {
    try {
        const { boardId } = req.params;
        const { name } = req.body;

        // Get the highest position for the current board and add 1
        const positionRes = await query(
            'SELECT MAX(position) as max_position FROM lists WHERE board_id = $1',
            [boardId]
        );
        const newPosition = (positionRes.rows[0].max_position || 0) + 1;

        const { rows } = await query(
            `INSERT INTO lists (name, board_id, position)
             VALUES ($1, $2, $3) RETURNING *`,
            [name, boardId, newPosition]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating list:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// PUT /api/lists/:listId (Simplified route for easier updates)
// Update a specific list
export const updateList = async (req, res) => {
    try {
        const { listId } = req.params;
        const { name, position } = req.body;
        const { rows } = await query(
            `UPDATE lists SET name = $1, position = $2
             WHERE id = $3 RETURNING *`,
            [name, position, listId]
        );
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error updating list:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// DELETE /api/lists/:listId (Simplified route)
// Delete a specific list
export const deleteList = async (req, res) => {
    try {
        const { listId } = req.params;
        const { rows } = await query(
            'DELETE FROM lists WHERE id = $1 RETURNING *',
            [listId]
        );
        res.status(200).json({ message: 'List deleted successfully', deletedList: rows[0] });
    } catch (error) {
        console.error('Error deleting list:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
