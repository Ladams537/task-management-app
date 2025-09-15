<!-- /src/lib/components/Card.svelte -->
<script lang="ts">
	type Task = {
		id: number;
		title: string;
	};
	const { task } = $props<{ task: Task }>();
</script>

<div class="bg-white/10 p-3 rounded-md shadow cursor-pointer text-white">
	{task.title}
</div>
