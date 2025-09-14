<script lang="ts">
	import { onMount } from 'svelte';
	import { io, type Socket } from 'socket.io-client';
	import Page from '../../routes/+page.svelte';

	// Type definitions for our data
	type List = {
		id: number;
		name: string;
		position: number;
	};

	type PageData = {
		boardId: string;
		boardName: string;
		lists: List[];
		error?: string;
	};

	const { data } = $props<{ data: PageData }>();

	let lists = $state(data.lists || []);
	let newListName = $state('');
	let socket: Socket;
	// NEW: State to control the visibility of the "Add List" form
	let isAddingList = $state(false);

	let listNameInput: HTMLInputElement | null = $state(null);
	function showListForm() {
		isAddingList = true;
		// Use setTimeout to ensure the input is rendered before focusing
		setTimeout(() => listNameInput?.focus(), 0);
	}

	$effect(() => {
		lists = (data.lists || []).sort((a: List, b: List) => a.position - b.position);
	});

	onMount(() => {
		socket = io('http://localhost:3000');
		socket.on('connect', () => console.log('Connected to WebSocket server!'));
		// Future: Listen for real-time list updates here

		return () => {
			if (socket) socket.disconnect();
		};
	});

	async function handleCreateList() {
		if (!newListName.trim()) return;

		try {
			const response = await fetch(`http://localhost:3000/api/board/${data.boardId}/lists`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: newListName })
			});

			if (!response.ok) throw new Error('Server error');

			const createdList = await response.json();
			lists.push(createdList);
			lists.sort((a: List, b: List) => a.position - b.position);

			// Reset the form
			newListName = '';
			isAddingList = false;
		} catch (error) {
			console.error('Error creating list:', error);
			alert('Could not create the list.');
		}
	}
</script>

<!-- The main container now fills the screen and arranges content in columns -->
<main class="h-screen w-screen bg-gray-900 text-white font-sans flex flex-col">
	<header class="p-4 bg-gray-900/50 backdrop-blur-sm">
		<a href="/" class="text-blue-400 hover:underline text-sm">&larr; Back to all boards</a>
		<h1 class="text-2xl font-bold mt-1">{data.boardName || 'Board View'}</h1>
	</header>

	<!-- This is the main Trello-style scrollable area -->
	<div class="flex-grow flex gap-4 p-4 overflow-x-auto">
		<!-- Display existing lists -->
		{#each lists as list (list.id)}
			<div class="bg-gray-800 p-2 rounded-lg shadow-lg w-72 flex-shrink-0 flex flex-col">
				<h3 class="text-lg font-semibold mb-3 px-2 py-1">{list.name}</h3>
				<div class="flex-grow space-y-3 overflow-y-auto px-1">
					<!-- Task cards will go here -->
					<div class="bg-gray-700 p-3 rounded-md shadow cursor-pointer">Example Task 1</div>
					<div class="bg-gray-700 p-3 rounded-md shadow cursor-pointer">Example Task 2</div>
				</div>
				<button class="mt-3 p-2 text-left text-gray-400 hover:bg-gray-700 rounded-md">
					+ Add a card
				</button>
			</div>
		{/each}

		<!-- "Add another list" button and form -->
		<div class="w-72 flex-shrink-0">
			{#if !isAddingList}
			<button
			type="button"
			onclick={showListForm}
			class="w-full p-3 text-left bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
		>
			+ Add another list
		</button>
			{:else}
				<form
					onsubmit={handleCreateList}
					class="bg-gray-800 p-2 rounded-lg shadow-lg"
				>
				<input
				type="text"
				bind:this={listNameInput}
				bind:value={newListName}
				placeholder="Enter list title..."
				class="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
					<div class="mt-2 flex items-center gap-2">
						<button
							type="submit"
							class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
						>
							Add List
						</button>
						<button
							type="button"
							onclick={() => (isAddingList = false)}
							class="text-gray-400 hover:text-white text-2xl"
						>
							&times;
						</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
</main>

<style>
	/* Custom scrollbar for a cleaner look in Webkit browsers (Chrome, Safari) */
	div::-webkit-scrollbar {
		height: 12px;
	}
	div::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 10px;
	}
	div::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.2);
		border-radius: 10px;
	}
	div::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.3);
	}
</style>
