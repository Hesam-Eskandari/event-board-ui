<script lang="ts">
	import type { Period } from '$lib/entities/period';
	import type { EventModel } from '$lib/entities/event';
	import PeriodDropdown from '$lib/components/period-dropdown/PeriodDropdown.svelte';
	import EChartWrapper from '$lib/components/echart-wrapper/EChartWrapper.svelte';
	import type { ChartData, ChartOption } from '$lib/types/types';
	import { ChartBuilderFactory, type ChartSubtype, type ChartType } from '$lib/chart-builder/chart-builder';
	import VisualizationCard from '$lib/components/visualization-card/VisualizationCard.svelte';

	export interface DashboardItemConfig {
		id: string;
		type: ChartType;
		subtype: ChartSubtype;
		width: string;
		height: string;
	}

	let { events, configs }: { events: EventModel[]; configs: DashboardItemConfig[] } = $props();
	let periods: (Period | null)[] = $derived(configs.map(() => null));
	let filteredEvents: EventModel[][] = $derived(configs.map(() => []));

	const builders = configs.map(config => new ChartBuilderFactory(config.type, config.subtype));
	let chartInfo: {option: ChartOption | null; data: ChartData | null; id: string; isReadyToRender:boolean; width: string; height: string;}[] = $derived(configs.map((c) => ({option: null, data: null, id: c.id, isReadyToRender: false, width: c.width, height: c.height})));

	function isEventOverlappingPeriod(event: EventModel, period: Period) {
		return (event.end.getTime() > period.duration.start.getTime() && event.end.getTime() < period.duration.end.getTime()) ||
			(event.start.getTime() > period.duration.start.getTime() && event.start.getTime() < period.duration.end.getTime());
	}

	function rebuildFilteredEvents(index: number) {
		filteredEvents[index] = periods[index] === null ? events : events.filter(e => isEventOverlappingPeriod(e, periods[index]!));
	}

	function buildCharts(index: number) {
		const chartBuilder = builders[index];
		const params = chartBuilder.generateParams(periods[index]!, filteredEvents[index]);
		let info = chartInfo[index];
		info.option = periods[index] === null ? null : chartBuilder.buildOptions(params.optionParams);
		info.data = chartBuilder.buildData(params.dataParams);
		info.isReadyToRender = true;
		info = {...info};
		chartInfo[index] = info;
		chartInfo = [...chartInfo];
	}

	function selectPeriod(p: Period, index: number) {
		periods[index] = p;
		rebuildFilteredEvents(index);
		buildCharts(index);
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
    .middle {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        min-width: 200px;
        min-height: 200px;
    }
		.cards {
				display: flex;
				flex-wrap: wrap;
				gap: 1rem;
		}
</style>

<div class="cards">
	{#each chartInfo as info, index (info.id)}
		<div style="width: {info.width}; height: {info.height};">
			<VisualizationCard >
				<div class="dropdown">
					<PeriodDropdown onSelect="{(p: Period) => selectPeriod(p, index)}" />
				</div>
				<div class="chart">
					<EChartWrapper option="{info.option}" data="{info.data}" isReadyToRender="{info.isReadyToRender}" />
				</div>
			</VisualizationCard>
		</div>
	{:else}
		<div class="middle">No Chart to show</div>
	{/each}
</div>


