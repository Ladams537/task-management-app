<!-- /src/lib/components/List.svelte -->
<script lang="ts">
	import Card from './Card.svelte';

	type Task = { id: number; title: string; position: number };
	type List = { id: number; name: string; tasks: Task[] };

	const { list, handleCreateTask } = $props<{
		list: List;
		handleCreateTask: (title: string, listId: number) => Promise<void>;
	}>();

	let addingTask = $state(false);
	let newTaskTitle = $state('');
	let taskInput: HTMLTextAreaElement | null = $state(null);

	function showTaskForm() {
		addingTask = true;
		setTimeout(() => taskInput?.focus(), 0);
	}

	function submitForm() {
		handleCreateTask(newTaskTitle, list.id);
		newTaskTitle = '';
		addingTask = false;
	}
</script>

<div class="bg-[#0d1117] p-2 rounded-lg shadow-lg w-72 flex-shrink-0 flex flex-col">
	<h3 class="text-lg font-semibold mb-3 px-2 py-1 text-white">{list.name}</h3>

	<div class="flex-grow space-y-3 overflow-y-auto px-1">
		{#each list.tasks as task (task.id)}
			<Card {task} />
		{/each}

		{#if addingTask}
			<form onsubmit={submitForm}>
				<textarea
					bind:this={taskInput}
					bind:value={newTaskTitle}
					placeholder="Enter a title for this card..."
					class="w-full p-3 bg-black rounded-md border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#21ffe8] resize-none"
					onkeydown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							submitForm();
						}
					}}
				></textarea>
				<div class="mt-2 flex items-center gap-2">
					<button type="submit" class="bg-[#20ccb8] hover:bg-[#21ffe8] text-black font-bold py-2 px-3 rounded-md text-sm">
						Add card
					</button>
					<button type="button" onclick={() => (addingTask = false)} class="text-gray-400 hover:text-white text-2xl">
						&times;
					</button>
				</div>
			</form>
		{/if}
	</div>

	{#if !addingTask}
		<button onclick={showTaskForm} class="mt-3 p-2 text-left text-gray-400 hover:bg-black rounded-md">
			+ Add a card
		</button>
	{/if}
</div>
