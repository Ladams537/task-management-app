<!-- /src/lib/components/BoardCard.svelte -->
<script lang="ts">
	type Board = {
		id: number;
		name: string;
		description?: string;
	};

	const { board } = $props<{ board: Board }>();

	/**
	 * Helper function to create a URL-friendly slug.
	 * "My Awesome Board" becomes "my-awesome-board"
	 */
	function slugify(text: string) {
		return text
			.toString()
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-') // Replace spaces with -
			.replace(/[^\w-]+/g, '') // Remove all non-word chars
			.replace(/--+/g, '-'); // Replace multiple - with single -
	}
</script>

<a
	href="/{slugify(board.name)}-{board.id}"
	class="block bg-[#0d1117] p-5 rounded-lg shadow-lg hover:shadow-[#21ffe8]/20 hover:-translate-y-1 transition-all duration-300"
>
	<h3 class="text-xl font-bold truncate text-white">{board.name}</h3>
	<p class="text-gray-400 mt-2 h-10 overflow-hidden">
		{board.description || 'No description provided.'}
	</p>
</a>
