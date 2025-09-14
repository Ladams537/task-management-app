<script lang="ts">
	// This page component is for the /[slug] route.
	// Its only job is to load the data via its +page.ts file
	// and then pass that data to your actual component.
	import Board from '$lib/components/Board.svelte';
	import type { PageData } from './$types';

	// The $props rune receives the data loaded from our +page.ts file
	const { data } = $props<{ data: PageData }>();
</script>

<!--
  This page acts as a simple container. It passes the loaded data
  down to your Board component, which handles all the display logic.
-->
<Board {data} />
