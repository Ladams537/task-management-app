<!-- /src/lib/components/Header.svelte -->
<script lang="ts">
	const { boardName } = $props<{ boardName: string }>();
</script>

<header class="p-4 bg-black/50 backdrop-blur-sm">
	<a href="/" class="text-[#21ffe8] hover:underline text-sm">&larr; Back to all boards</a>
	<h1 class="text-2xl font-bold mt-1 text-white">{boardName || 'Board View'}</h1>
</header>
