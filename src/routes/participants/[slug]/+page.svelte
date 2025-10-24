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
	import { type EChartsOption } from 'echarts';
	import * as echarts from 'echarts';
	import { PieChartBuilder } from '$lib/chart-builder/pie-chart-builder';

	interface Duration {
		start: Date;
		end: Date;
	}

	interface Period {
		duration: Duration;
		name: string;
		id: string;
	}

	const id = $derived(page.params.slug);

	const participantService: ParticipantService = ParticipantStore.getInstance();
	const eventService: EventService = EventStore.getInstance();

	let pSub: Unsubscriber | null = null;
	let eSub: Unsubscriber | null = null;
	let participant: ParticipantModel | null = $state(null);
	let now = new Date();
	let periods: Period[] = [
		{
			name: 'Week',
			id: 'week',
			duration: {
				end: now,
				start: new Date(now.getTime() - 7 * 86400000)
			}
		},
		{
			name: 'Month',
			id: 'month',
			duration: {
				end: now,
				start: new Date(now.getTime() - 30 * 86400000)
			}
		},
		{
			name: 'Day',
			id: 'day',
			duration: {
				end: now,
				start: new Date(now.getTime() - 86400000)
			}
		}
	];
	let periodId = $state(periods[0].id);
	let events: EventModel[] = $state([]);
	let chartElement: HTMLDivElement | null = $state(null);



	let period: Period | null = $derived(periods.find((p) => p.id === periodId) ?? null);
	let myEvents: EventModel[] = $derived(events.filter(ev => ev.participant.id === id));
	let filteredEvents: EventModel[] = $derived(period === null ? myEvents : myEvents.filter(e => (e.end.getTime() > period.duration.start.getTime() && e.end.getTime() < period.duration.end.getTime()) || (e.start.getTime() > period.duration.start.getTime() && e.start.getTime() < period.duration.end.getTime())));
	const pieChartBuilder = new PieChartBuilder();
	let option: EChartsOption = $derived(pieChartBuilder.buildOptions('Categories', period!.name));
	const sourceData = $derived(pieChartBuilder.buildData(filteredEvents));
	let chart: echarts.ECharts | null = $state(null);
	$effect(() => {
		option.dataset ={
			source: sourceData
		};
		if (chart !== null) {
			chart.setOption(option);
		}
	});

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

		chart = echarts.init(chartElement);

	});

	onDestroy(() => {
		pSub?.();
		eSub?.();
	});
</script>

<style>
	.chart {
			width: 100%;
			min-height: 300px;
			height: 100%;
	}
</style>

<div>Single Participant Page</div>
{#if participant !== null}
	<div>Name: {participant.firstname} {participant.lastname}</div>
{/if}

<select bind:value={periodId}>
	{#each periods as period}
		<option value={period.id}>{period.name}</option>
	{/each}
</select>

<div class="chart" bind:this={chartElement}></div>