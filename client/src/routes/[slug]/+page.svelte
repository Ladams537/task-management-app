<script lang="ts">
	// This page component is for the /[slug] route.
	// Its only job is to load the data via its +page.ts file
	// and then pass that data to your actual component.
	import { Board } from '$lib/index';
	import type { PageData } from './$types';

	// The $props rune receives the data loaded from our +page.ts file
	const { data } = $props<{ data: PageData }>();
</script>

<Board {data} />
