import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// Define types for our data structures
type Task = {
	id: number;
	title: string;
	position: number;
};

type List = {
	id: number;
	name: string;
	position: number;
	tasks: Task[]; // Each list will now contain its tasks
};

export const load: PageLoad = async ({ fetch, params }) => {
	try {
		const { slug } = params;
		const idMatch = slug.match(/-(\d+)$/);

		if (!idMatch) {
			throw error(404, 'Not Found: Invalid board URL');
		}

		const boardId = idMatch[1];
		// 1. Correctly parse the board name from the slug.
		const boardName = slug.replace(/-\d+$/, '').replace(/-/g, ' ');

		// 2. Fetch the lists for the board. The response from this URL is the array of lists.
		const listsRes = await fetch(`http://localhost:3000/api/board/${boardId}`);
		if (!listsRes.ok) throw error(listsRes.status, 'Could not load lists for this board.');

		const lists: List[] = await listsRes.json();

		// 3. Fetch all tasks for all lists in parallel using the correct task API route.
		await Promise.all(
			lists.map(async (list) => {
				const tasksRes = await fetch(`http://localhost:3000/api/list/${list.id}`);
				if (!tasksRes.ok) {
					console.error(`Failed to fetch tasks for list ${list.id}`);
					list.tasks = []; // Assign empty array on failure to prevent crashes
					return;
				}
				list.tasks = await tasksRes.json();
			})
		);

		// 4. Return the boardId, the parsed boardName, and the lists (now populated with tasks).
		return {
			boardId,
			boardName,
			lists
		};
	} catch (err) {
		// If the original error was a SvelteKit error (like our 404), re-throw it.
		if (err instanceof Error && 'status' in err) {
			throw err;
		}
		// For any other kind of error, log it and show a generic server error page.
		console.error('Failed to load board page:', err);
		throw error(500, 'Could not load the board. Is the server running?');
	}
};

