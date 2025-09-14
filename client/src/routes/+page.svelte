<script lang="ts">
    import Boards from '$lib/components/Boards.svelte';
    import type { PageData } from './$types';
    
    const { data } = $props<{ data: PageData }>();
</script>

<Boards {data} />
