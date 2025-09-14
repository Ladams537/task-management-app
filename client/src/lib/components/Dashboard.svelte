<script lang="ts">
	import { onMount } from 'svelte';
	import { io, type Socket } from 'socket.io-client';

	// ... existing type definitions ...
	type Board = {
		id: number;
		name: string;
		description?: string;
	};

	type PageData = {
		boards: Board[];
		error?: string;
	};


	const { data } = $props<{ data: PageData }>();
	let boards = $state(data.boards || []);
	let newBoardName = $state('');
	let socket: Socket;

	// ... existing $effect and onMount blocks ...
	$effect(() => {
		boards = data.boards || [];
	});

	onMount(() => {
		socket = io('http://localhost:3000');

		socket.on('connect', () => console.log('Connected to WebSocket server!'));
		socket.on('board:created', (newBoardFromServer: Board) => {
			console.log('Received new board from server:', newBoardFromServer.name);
			const boardExists = boards.some((b: Board) => b.id === newBoardFromServer.id);
			if (!boardExists) {
				boards.push(newBoardFromServer);
			}
		});

		return () => {
			if (socket) socket.disconnect();
		};
	});


	async function handleCreateBoard() {
		if (!newBoardName.trim()) {
			alert('Please enter a board name.');
			return;
		}

		try {
			await fetch('http://localhost:3000/api/dashboard', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: newBoardName })
			});
			newBoardName = '';
		} catch (error) {
			console.error('Error creating board:', error);
			alert('Could not create the board. Please check the server connection.');
		}
	}

	/**
	 * NEW: Helper function to create a URL-friendly slug.
	 * "My Awesome Board" becomes "my-awesome-board"
	 */
	function slugify(text: string) {
		return text
			.toString()
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-') // Replace spaces with -
			.replace(/[^\w\-]+/g, '') // Remove all non-word chars
			.replace(/\-\-+/g, '-'); // Replace multiple - with single -
	}
</script>

<main class="min-h-screen bg-gray-900 text-white font-sans">
	<div class="container mx-auto p-8">
		<!-- ... existing form ... -->
		<h1 class="text-4xl font-bold mb-8">Task Boards</h1>
		<div class="mb-10 p-6 bg-gray-800 rounded-lg shadow-xl">
			<h2 class="text-2xl font-semibold mb-4">Create a New Board</h2>
			<form onsubmit={handleCreateBoard} class="flex flex-col sm:flex-row gap-4">
				<input
					type="text"
					bind:value={newBoardName}
					placeholder="Enter board name..."
					class="flex-grow p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
				/>
				<button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors">
					Create Board
				</button>
			</form>
		</div>

		{#if boards.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each boards as board (board.id)}
					<a
						href="/{slugify(board.name)}-{board.id}"
						class="block bg-gray-800 p-5 rounded-lg shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300"
					>
						<h3 class="text-xl font-bold truncate">{board.name}</h3>
						<p class="text-gray-400 mt-2 h-10 overflow-hidden">
							{board.description || 'No description provided.'}
						</p>
					</a>
				{/each}
			</div>
		{:else if !data.error}
			<div class="text-center bg-gray-800 p-10 rounded-lg shadow-xl">
				<h2 class="text-2xl font-semibold mb-4">No boards yet!</h2>
				<p class="text-gray-400">Use the form above to create your first board.</p>
			</div>
		{/if}
		{#if data.error}
			<div class="mt-8 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg shadow-lg">
				<strong>Oops!</strong> {data.error}
			</div>
		{/if}
	</div>
</main>
