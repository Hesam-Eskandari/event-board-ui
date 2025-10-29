<script lang="ts">
	import type { Period } from '$lib/entities/period';
	import type { EventModel } from '$lib/entities/event';
	import EChartWrapper from '$lib/components/echart-wrapper/EChartWrapper.svelte';
	import { ChartBuilderFactory } from '$lib/chart-builder/chart-builder';
	import VisualizationCard from '$lib/components/visualization-card/VisualizationCard.svelte';
	import type { DashboardItemConfig } from '$lib/entities/dashboard-item';
	import { ChartModel } from '$lib/entities/chart';

	let { events, configs }: { events: EventModel[]; configs: DashboardItemConfig[] } = $props();

	const builders = configs.map(config => new ChartBuilderFactory(config.type, config.subtype));
	let chartModels: ChartModel[] = $derived(
		configs.map(c => new ChartModel()
			.setFilterConfig(c.filterConfig)
			.setWidth(c.width)
			.setHeight(c.height))
	);

	function buildCharts(filteredEvents: EventModel[], period: Period, index: number) {
		const chartBuilder = builders[index];
		const params = chartBuilder.generateParams(period, filteredEvents);
		chartModels[index] = chartModels[index]
			.setChartOption(chartBuilder.buildOptions(params.optionParams))
			.setChartData(chartBuilder.buildData(params.dataParams))
			.setIsReadyToRender(true)
			.clone();
		chartModels = [...chartModels];
	}

</script>

<style>
    .chart {
        width: 100%;
				height: 100%;
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
	{#each chartModels as chart, index (chart.getId())}
		<div style="width: {chart.getWidth()}; height: {chart.getHeight()};">
			<VisualizationCard {events} filterConfig={chart.getFilterConfig()} onFilter={(events: EventModel[], p: Period) => buildCharts(events, p, index)} >
				<div class="chart">
					<EChartWrapper option={chart.getChartOption()} data={chart.getChartData()} isReadyToRender={chart.getIsReadyToRender()} />
				</div>
			</VisualizationCard>
		</div>
	{:else}
		<div class="middle">No Chart to show</div>
	{/each}
</div>
