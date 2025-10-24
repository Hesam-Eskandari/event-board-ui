<script lang="ts">
	import type { Period } from '$lib/entities/period';
	import { DateTimeHelper } from '$lib/utils/dateTime';
	import type { EventModel } from '$lib/entities/event';
	import { SinglePersonCategoriesPieChartBuilder } from '$lib/chart-builder/single-person-categories-pie-chart-builder';
	import { type EChartsOption } from 'echarts';
	import * as echarts from 'echarts';
	import { onMount } from 'svelte';

	let { events }: { events: EventModel[] } = $props();

	let periods: Period[] = DateTimeHelper.buildPeriods();
	let periodId = $state(periods[0].id);
	let chartElement: HTMLDivElement | null = $state(null);
	let period: Period | null = $derived(periods.find((p) => p.id === periodId) ?? null);
	let filteredEvents: EventModel[] = $derived(period === null ? events : events.filter(e => (e.end.getTime() > period.duration.start.getTime() && e.end.getTime() < period.duration.end.getTime()) || (e.start.getTime() > period.duration.start.getTime() && e.start.getTime() < period.duration.end.getTime())));
	const pieChartBuilder = new SinglePersonCategoriesPieChartBuilder();
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
		chart = echarts.init(chartElement);
	});
</script>

<style>
    .chart {
        width: 100%;
        min-height: 300px;
        height: 100%;
    }
</style>

<select bind:value={periodId}>
	{#each periods as period}
		<option value={period.id}>{period.name}</option>
	{/each}
</select>
<div class="chart" bind:this={chartElement}></div>
