<script lang="ts">
	import Event from '$lib/components/event/Event.svelte';
	import type { EventModel } from '$lib/entities/event';
	let { events=[], onDelete, onEdit }:
		{
			events: EventModel[],
			onDelete: (event: EventModel) => void,
			onEdit: (event: EventModel) => void,
		} = $props();
</script>
<style>
    .grid {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1rem;
    }
</style>

<div class="grid">
	{#each events as event (event.id)}
		<Event {onDelete} {onEdit} {event} />
	{:else}
		<div>No Events</div>
	{/each}
</div>
