<script lang="ts">
	import { onMount } from 'svelte';
	import { io, type Socket } from 'socket.io-client';
	import Header from './board/Header.svelte';
	import List from './board/List.svelte';
	import Form from './board/Form.svelte';
	import Scroll from './Scroll.svelte';

	// Type definitions
	type Task = { id: number; title: string; position: number };
	type ListType = { id: number; name: string; position: number; tasks: Task[] };
	type PageData = { boardId: string; boardName: string; lists: ListType[]; error?: string };

	const { data } = $props<{ data: PageData }>();

	let lists = $state(data.lists || []);
	let socket: Socket;

	$effect(() => {
		lists = (data.lists || []).sort((a: ListType, b: ListType) => a.position - b.position);
	});

	onMount(() => {
		socket = io('http://localhost:3000');
		socket.on('connect', () => console.log('Connected to WebSocket server!'));
		// Future: We will add real-time events for tasks and lists here
		return () => {
			if (socket) socket.disconnect();
		};
	});

	async function handleCreateList(name: string) {
		if (!name.trim()) return;
		try {
			const response = await fetch(`http://localhost:3000/api/board/${data.boardId}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name })
			});
			if (!response.ok) throw new Error('Server error');
			const createdList: ListType = await response.json();
			createdList.tasks = [];
			lists.push(createdList);
		} catch (error) {
			console.error('Error creating list:', error);
			alert('Could not create the list.');
		}
	}

	async function handleCreateTask(title: string, listId: number) {
		if (!title.trim()) return;
		try {
			const response = await fetch(`http://localhost:3000/api/list/${listId}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title })
			});
			if (!response.ok) throw new Error('Server error when creating task');
			const createdTask: Task = await response.json();
			const listIndex = lists.findIndex((l: ListType) => l.id === listId);
			if (listIndex !== -1) {
				lists[listIndex].tasks.push(createdTask);
			}
		} catch (error) {
			console.error('Error creating task:', error);
			alert('Could not create the task.');
		}
	}
</script>

<main class="h-screen w-screen bg-black text-white font-sans flex flex-col">
	<Header boardName={data.boardName} />

	<Scroll>
		{#each lists as list (list.id)}
			<List {list} {handleCreateTask} />
		{/each}

		<Form {handleCreateList} />
	</Scroll>
</main>



