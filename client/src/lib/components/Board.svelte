<script lang="ts">
	import { onMount } from 'svelte';
	import { io, type Socket } from 'socket.io-client';

	// --- Type definitions updated to include tasks within lists ---
	type Task = {
		id: number;
		title: string;
		position: number;
	};

	type List = {
		id: number;
		name: string;
		position: number;
		tasks: Task[]; // This is the key change
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
	let isAddingList = $state(false);
	let listNameInput: HTMLInputElement | null = $state(null);

	// --- NEW: State for adding tasks ---
	let addingTaskToListId = $state<number | null>(null);
	let newTaskTitle = $state('');
	let taskInput: HTMLInputElement | null = $state(null);

	function showListForm() {
		isAddingList = true;
		setTimeout(() => listNameInput?.focus(), 0);
	}

	function showTaskForm(listId: number) {
		newTaskTitle = '';
		addingTaskToListId = listId;
		setTimeout(() => taskInput?.focus(), 0);
	}

	$effect(() => {
		lists = (data.lists || []).sort((a: List, b: List) => a.position - b.position);
	});

	onMount(() => {
		socket = io('http://localhost:3000');
		socket.on('connect', () => console.log('Connected to WebSocket server!'));

		return () => {
			if (socket) socket.disconnect();
		};
	});

	async function handleCreateList(event: SubmitEvent) {
		if (!newListName.trim()) return;

		try {
			const response = await fetch(`http://localhost:3000/api/board/${data.boardId}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: newListName })
			});
			if (!response.ok) throw new Error('Server error');

			const createdList = await response.json();
			createdList.tasks = [];
			lists.push(createdList);
			lists.sort((a: List, b: List) => a.position - b.position);

			newListName = '';
			isAddingList = false;
		} catch (error) {
			console.error('Error creating list:', error);
			alert('Could not create the list.');
		}
	}

	async function handleCreateTask() {
		if (!newTaskTitle.trim() || addingTaskToListId === null) return;

		try {
			// --- CORRECTED: The API endpoint now matches your new server.js routing ---
			const response = await fetch(`http://localhost:3000/api/list/${addingTaskToListId}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title: newTaskTitle })
			});

			if (!response.ok) throw new Error('Server error when creating task');

			const createdTask = await response.json();

			const listIndex = lists.findIndex((l: List) => l.id === addingTaskToListId);
			if (listIndex !== -1) {
				lists[listIndex].tasks.push(createdTask);
			}

			newTaskTitle = '';
			addingTaskToListId = null;
		} catch (error) {
			console.error('Error creating task:', error);
			alert('Could not create the task.');
		}
	}
	
	function handleTaskInputKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleCreateTask();
		}
	}
</script>

<main class="h-screen w-screen bg-gray-900 text-white font-sans flex flex-col">
	<header class="p-4 bg-gray-900/50 backdrop-blur-sm">
		<a href="/" class="text-blue-400 hover:underline text-sm">&larr; Back to all boards</a>
		<h1 class="text-2xl font-bold mt-1">{data.boardName || 'Board View'}</h1>
	</header>

	<div class="flex-grow flex gap-4 p-4 overflow-x-auto">
		{#each lists as list (list.id)}
			<div class="bg-gray-800 p-2 rounded-lg shadow-lg w-72 flex-shrink-0 flex flex-col">
				<h3 class="text-lg font-semibold mb-3 px-2 py-1">{list.name}</h3>
				<div class="flex-grow space-y-3 overflow-y-auto px-1">
					{#each list.tasks as task (task.id)}
						<div class="bg-gray-700 p-3 rounded-md shadow cursor-pointer">{task.title}</div>
					{/each}

					{#if addingTaskToListId === list.id}
						<!-- --- CORRECTED: Use modern Svelte 5 event handling --- -->
						<form onsubmit={handleCreateTask}>
							<input
								type="text"
								bind:this={taskInput}
								bind:value={newTaskTitle}
								placeholder="Enter a title for this card..."
								class="w-full p-3 bg-gray-600 rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								onkeydown={handleTaskInputKeydown}
							/>
							<div class="mt-2 flex items-center gap-2">
								<button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md text-sm">
									Add card
								</button>
								<button type="button" onclick={() => (addingTaskToListId = null)} class="text-gray-400 hover:text-white text-2xl">
									&times;
								</button>
							</div>
						</form>
					{/if}
				</div>
				{#if addingTaskToListId !== list.id}
					<button onclick={() => showTaskForm(list.id)} class="mt-3 p-2 text-left text-gray-400 hover:bg-gray-700 rounded-md">
						+ Add a card
					</button>
				{/if}
			</div>
		{/each}

		<div class="w-72 flex-shrink-0">
			{#if !isAddingList}
				<button type="button" onclick={showListForm} class="w-full p-3 text-left bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
					+ Add another list
				</button>
			{:else}
				<!-- --- CORRECTED: Use modern Svelte 5 event handling --- -->
				<form onsubmit={handleCreateList}>
					<input
						type="text"
						bind:this={listNameInput}
						bind:value={newListName}
						placeholder="Enter list title..."
						class="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<div class="mt-2 flex items-center gap-2">
						<button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
							Add List
						</button>
						<button type="button" onclick={() => (isAddingList = false)} class="text-gray-400 hover:text-white text-2xl">
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

