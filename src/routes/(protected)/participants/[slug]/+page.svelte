<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { Unsubscriber } from 'svelte/store';
	import { page } from '$app/state';
	import { type ParticipantService } from '$lib/services/participant.service';
	import { ParticipantStore } from '$lib/store/participants.store';
	import type { ParticipantModel } from '$lib/entities/participant';
	import type { DataStatus } from '$lib/entities/data-status';
	import type { EventService } from '$lib/services/event.service';
	import { EventStore } from '$lib/store/event.store';
	import type { EventModel } from '$lib/entities/event';
	import ChartDashboard  from '$lib/components/chart-dashboard/ChartDashboard.svelte';
	import type { DashboardItemConfig } from '$lib/entities/dashboard-item';

	const participantId = $derived(page.params.slug);

	const participantService: ParticipantService = ParticipantStore.getInstance();
	const eventService: EventService = EventStore.getInstance();

	let pSub: Unsubscriber | null = null;
	let eSub: Unsubscriber | null = null;
	let participant: ParticipantModel | null = $state(null);

	let events: EventModel[] = $state([]);
	let personalEvents: EventModel[] = $derived(events.filter(ev => ev.participant.id === participantId));
	const configs: DashboardItemConfig[] = [
		{
			type: 'pie',
			subtype: 'person-category',
			width: '580px',
			height: '400px',
			id: '1',
			filterConfig: {
				id: '1',
				type: 'dropdown',
				position: 'top-left',
			}
		},
		{
			type: 'pie',
			subtype: 'person-category',
			width: '480px',
			height: '400px',
			id: '2',
			filterConfig: null
		}
	];

	onMount(() => {
		pSub = participantService.getParticipants().subscribe((ds: DataStatus<ParticipantModel[]>) => {
			if (ds.status === 'success') {
				const participants = ds.data;
				participant = participants.find(p => p.id === participantId) ?? null
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
	.dashboard {
			padding: 50px;
	}
</style>


{#if participant !== null}
	<div>Name: {participant.firstname} {participant.lastname}</div>
{/if}
<div class="dashboard">
	<ChartDashboard events={personalEvents} {configs}/>
</div>

