import { query } from '../db/index.js';

/**
 * GET /api/list/:listId
 * Get all tasks for a specific list
 */
export const getAllTasksForList = async (req, res) => {
	try {
		const { listId } = req.params;
		const { rows } = await query(
			`SELECT * FROM tasks WHERE list_id = $1 ORDER BY position ASC`,
			[listId]
		);
		res.status(200).json(rows);
	} catch (error) {
		console.error('Error fetching tasks:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

/**
 * POST /api/list/:listId
 * Create a new task. The listId is provided in the request body.
 */
export const createTask = async (req, res) => {
	try {
		    // --- ADD THESE LOGS ---
			console.log('--- Create Task Request Received ---');
			console.log('URL Params (req.params):', req.params);
			console.log('Request Body (req.body):', req.body);
			// --- END OF LOGS ---
			
		// listId now comes from the request body
		const { listId } = req.params;
		const { title } = req.body;

		// We still need a creator_id, hardcoded for now
		const creatorId = 1;

		if (!listId || !title) {
			return res.status(400).json({ error: 'Missing title or listId' });
		}

		// Calculate the position for the new task
		const positionResult = await query(
			'SELECT COALESCE(MAX(position), -1) + 1'
			+ ' AS new_position FROM tasks WHERE list_id = $1',
			[listId]
		);
		const newPosition = positionResult.rows[0].new_position;

		const { rows } = await query(
			`INSERT INTO tasks (title, description, list_id, creator_id, due_date, position, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
			[title, null, listId, creatorId, null, newPosition, new Date()]
		);

		res.status(201).json(rows[0]);
	} catch (error) {
		console.error('Error creating task:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};
