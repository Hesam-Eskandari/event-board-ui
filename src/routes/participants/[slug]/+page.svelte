<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import { page } from '$app/state';
	import { type ParticipantService } from '$lib/services/participant.service';
	import { ParticipantStore } from '$lib/store/participants.store';
	import type { ParticipantModel } from '$lib/entities/participant';
	import type { DataStatus } from '$lib/entities/dataStatus';
	import type { EventService } from '$lib/services/event.service';
	import { EventStore } from '$lib/store/event.store';
	import type { EventModel } from '$lib/entities/event';
	import  VisualizationCard  from '$lib/components/visualization-card/VisualizationCard.svelte';
	import SinglePersonCategoriesPieChart from '$lib/components/single-person-categories-pie-chart/SinglePersonCategoriesPieChart.svelte';

	const id = $derived(page.params.slug);

	const participantService: ParticipantService = ParticipantStore.getInstance();
	const eventService: EventService = EventStore.getInstance();

	let pSub: Unsubscriber | null = null;
	let eSub: Unsubscriber | null = null;
	let participant: ParticipantModel | null = $state(null);

	let events: EventModel[] = $state([]);
	let myEvents: EventModel[] = $derived(events.filter(ev => ev.participant.id === id));

	onMount(() => {
		pSub = participantService.getParticipants().subscribe((ds: DataStatus<ParticipantModel[]>) => {
			if (ds.status === 'success') {
				const participants = ds.data;
				participant = participants.find(p => p.id === id) ?? null
			}
		});
		eSub = eventService.getEvents().subscribe((ds: DataStatus<EventModel[]>) => {
			if (ds.status === 'success') {
				events = ds.data;
			}
		});

	});

	onDestroy(() => {
		pSub?.();
		eSub?.();
	});
</script>

<style>
	.category-pie-card {
			width: 400px;
			max-height: 300px;
	}
</style>


{#if participant !== null}
	<div>Name: {participant.firstname} {participant.lastname}</div>
{/if}
<div class="category-pie-card">
	<VisualizationCard >
		<SinglePersonCategoriesPieChart events="{myEvents}"/>
	</VisualizationCard>
</div>
