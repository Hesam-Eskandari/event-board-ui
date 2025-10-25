<script lang="ts">
	import type { Period } from '$lib/entities/period';
	import type { EventModel } from '$lib/entities/event';
	import { SinglePersonCategoriesPieChartBuilder } from '$lib/chart-builder/single-person-categories-pie-chart-builder';
	import PeriodDropdown from '$lib/components/period-dropdown/PeriodDropdown.svelte';
	import Chart from '$lib/components/chart/Chart.svelte';
	import type { ChartOption } from '$lib/types/types';
	import { DateTimeHelper } from '$lib/utils/dateTime';

	let { events }: { events: EventModel[] } = $props();


	let period: Period | null = $state(null);
	let filteredEvents: EventModel[] = $derived(period === null ? events : events.filter(e => isEventOverlappingPeriod(e, period!)));
	let isReadyToRender: boolean = $state(true);
	const pieChartBuilder = new SinglePersonCategoriesPieChartBuilder();
	let option: ChartOption | null = $derived(period === null ? null : pieChartBuilder.buildOptions('Categories', DateTimeHelper.getShortTextDuration(period.duration)));
	const sourceData = $derived(pieChartBuilder.buildData(filteredEvents));

	function isEventOverlappingPeriod(event: EventModel, period: Period) {
		return (event.end.getTime() > period.duration.start.getTime() && event.end.getTime() < period.duration.end.getTime()) ||
			(event.start.getTime() > period.duration.start.getTime() && event.start.getTime() < period.duration.end.getTime());
	}

	function selectPeriod(p: Period) {
		period = p;
	}
</script>

<style>
    .chart {
        width: 100%;
				height: 100%;
    }
		.dropdown {
        position: absolute;
				z-index: 1;
		}
</style>

<div class="dropdown">
	<PeriodDropdown onSelect="{selectPeriod}" />
</div>
<div class="chart">
	<Chart {option} data="{sourceData}" {isReadyToRender} />
</div>

