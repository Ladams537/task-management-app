<!-- /src/lib/components/ScrollContainer.svelte -->
<!-- This component provides a horizontally scrolling container with a custom scrollbar. -->
<!-- Any components placed inside it will be arranged in a row. -->

<!--
  --- THE FIX ---
  Added `min-h-0` to this div.
  In a flex column, this class allows a child element with `flex-grow` to correctly shrink and expand
  to fill the available space, which is essential for making the `overflow-x-auto` work as expected.
-->
<div class="flex-grow flex gap-4 p-4 overflow-x-auto min-h-0">
	<slot />
</div>

<style>
	/* Custom scrollbar for a cleaner look */
	div::-webkit-scrollbar {
		height: 12px;
	}
	div::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 10px;
	}
	div::-webkit-scrollbar-thumb {
		background: rgba(33, 255, 232, 0.4);
		border-radius: 10px;
	}
	div::-webkit-scrollbar-thumb:hover {
		background: rgba(33, 255, 232, 0.6);
	}
</style>