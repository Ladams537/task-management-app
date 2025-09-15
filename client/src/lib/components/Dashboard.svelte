<!-- /src/lib/components/Dashboard.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { io, type Socket } from 'socket.io-client';
	import BoardForm from './dashboard/Form.svelte';
	import BoardCard from './dashboard/Card.svelte';

	// Type definitions
	type Board = { id: number; name: string; description?: string };
	type PageData = { boards: Board[]; error?: string };

	const { data } = $props<{ data: PageData }>();

	let boards = $state(data.boards || []);
	let socket: Socket;

	$effect(() => {
		boards = data.boards || [];
	});

	onMount(() => {
		socket = io('http://localhost:3000');
		socket.on('connect', () => console.log('Connected to WebSocket server!'));

		socket.on('board:created', (newBoardFromServer: Board) => {
			const boardExists = boards.some((b: Board) => b.id === newBoardFromServer.id);
			if (!boardExists) {
				boards.push(newBoardFromServer);
			}
		});

		return () => {
			if (socket) socket.disconnect();
		};
	});

	async function handleCreateBoard(name: string) {
		if (!name.trim()) return;
		try {
			// The WebSocket will handle the UI update, so we just send the request.
			await fetch('http://localhost:3000/api/dashboard', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name })
			});
		} catch (error) {
			console.error('Error creating board:', error);
			alert('Could not create the board.');
		}
	}
</script>

<main class="min-h-screen bg-black text-white font-sans">
	<div class="container mx-auto p-8">
		<h1 class="text-4xl font-bold mb-8">Task Boards</h1>

		<BoardForm {handleCreateBoard} />

		{#if boards.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each boards as board (board.id)}
					<BoardCard {board} />
				{/each}
			</div>
		{:else if !data.error}
			<div class="text-center bg-[#0d1117] p-10 rounded-lg shadow-xl">
				<h2 class="text-2xl font-semibold mb-4">No boards yet!</h2>
				<p class="text-gray-400">Use the form above to create your first board.</p>
			</div>
		{/if}

		{#if data.error}
			<div class="mt-8 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg shadow-lg">
				<strong>Oops!</strong> {data.error}
			</div>
		{/if}
	</div>
</main>

