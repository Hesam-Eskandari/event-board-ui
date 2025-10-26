<script lang="ts">
	import type { ChartData, ChartOption, Chart } from '$lib/types/types';
	import * as echarts from 'echarts';

	let {
		data,
		option,
		isReadyToRender=false }: {
		data: ChartData | null;
		option: ChartOption | null;
		isReadyToRender: boolean;
	} = $props();

	let chartElement: HTMLDivElement | null = $state(null);
	let chartData = $derived(data);
	let chartOption = $derived(option);
	let chart: Chart | null = $state(null);
	let status: 'wait' | 'rendering' | 'rendered' = $derived(isReadyToRender && chartData != null && chartData.length > 0 && chartOption != null ? 'rendering' : 'wait');

	$effect(() => {
		if (status === 'wait' && chart !== null) {
			chart.clear();
		}
		if (status !== 'rendering') {
			return;
		}
		status = 'rendered';
		buildChart();
	});

	function buildChart() {
		if (chart === null) {
			chart = echarts.init(chartElement);
		}
		if (chartData === null || chartOption === null) {
			return;
		}
		chartOption.dataset = {
			source: chartData
		};
		chart.setOption(chartOption);
	}
</script>

<style>
		.middle {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100%;
				width: 100%;
        min-width: 200px;
        min-height: 200px;
		}
</style>

{#if !isReadyToRender}
	<div class="middle">Waiting</div>
{:else if chartData === null || chartData.length === 0}
	<div class="middle">No Data</div>
{:else if chartOption === null}
	<div class="middle">No Option</div>
{/if}
<div class="middle" hidden="{status === 'wait'}"  bind:this={chartElement}></div>
