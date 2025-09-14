<script lang="ts">
    import { Dashboard } from '$lib/index';
    import type { PageData } from './$types';
    
    const { data } = $props<{ data: PageData }>();
</script>

<Dashboard {data} />
