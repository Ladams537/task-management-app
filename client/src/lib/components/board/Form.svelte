<!-- /src/lib/components/Form.svelte -->
<script lang="ts">
	let isAddingList = $state(false);
	let newListName = $state('');
	let listNameInput: HTMLInputElement | null = $state(null);

	// Props for the component to receive
	const { handleCreateList } = $props<{ handleCreateList: (name: string) => Promise<void> }>();

	function showListForm() {
		isAddingList = true;
		setTimeout(() => listNameInput?.focus(), 0);
	}

	function submitForm() {
		handleCreateList(newListName);
		// Reset form state after submission
		newListName = '';
		isAddingList = false;
	}
</script>

<div class="w-72 flex-shrink-0">
	{#if !isAddingList}
		<button onclick={showListForm} class="w-full p-3 text-left bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white">
			+ Add another list
		</button>
	{:else}
		<form onsubmit={submitForm} class="bg-[#0d1117] p-2 rounded-lg shadow-lg">
			<input
				bind:this={listNameInput}
				bind:value={newListName}
				placeholder="Enter list title..."
				class="w-full p-2 bg-black rounded-md border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#21ffe8]"
			/>
			<div class="mt-2 flex items-center gap-2">
				<button type="submit" class="bg-[#20ccb8] hover:bg-[#21ffe8] text-black font-bold py-2 px-4 rounded-md">
					Add List
				</button>
				<button type="button" onclick={() => (isAddingList = false)} class="text-gray-400 hover:text-white text-2xl">
					&times;
				</button>
			</div>
		</form>
	{/if}
</div>
