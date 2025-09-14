import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	try {
		const { slug } = params; // The slug is now e.g., "my-board-name-123"

		// Use a regular expression to find the numeric ID at the end of the slug
		const idMatch = slug.match(/-(\d+)$/);

		// If no ID is found in the slug, the URL is invalid, so we show a 404 page.
		if (!idMatch) {
			throw error(404, 'Not found');
		}

		const boardId = idMatch[1]; // The captured ID (e.g., "123")
		const boardName = slug.replace(/-/g, ' ').replace(/\d+$/, ''); // Remove the ID and hyphens

		const response = await fetch(`http://localhost:3000/api/board/${boardId}/lists`);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const lists = await response.json();

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

		console.error('Failed to fetch lists:', err);
		return {
			boardId: '',
			boardName: '',
			lists: [],
			error: 'Could not load the lists for this board.'
		};
	}
};
