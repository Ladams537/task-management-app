<!-- /src/lib/components/CreateBoardForm.svelte -->
<script lang="ts">
	// This component only manages its own input state and calls the function passed to it.
	let newBoardName = $state('');
	const { handleCreateBoard } = $props<{ handleCreateBoard: (name: string) => Promise<void> }>();

	function submitForm() {
		handleCreateBoard(newBoardName);
		newBoardName = ''; // Reset the input after submission
	}
</script>

<div class="mb-10 p-6 bg-[#0d1117] rounded-lg shadow-xl">
	<h2 class="text-2xl font-semibold mb-4 text-white">Create a New Board</h2>
	<form onsubmit={submitForm} class="flex flex-col sm:flex-row gap-4">
		<input
			type="text"
			bind:value={newBoardName}
			placeholder="Enter board name..."
			class="flex-grow p-3 bg-black rounded-md border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#21ffe8] transition"
		/>
		<button type="submit" class="bg-[#20ccb8] hover:bg-[#21ffe8] text-black font-bold py-3 px-6 rounded-md transition-colors">
			Create Board
		</button>
	</form>
</div>
