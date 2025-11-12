import type { ChartData, ChartOption } from '$lib/types/types';
import {
	PieChartBuilderFactory,
	type PieChartDataParams,
	type PieChartOptionParams,
	type PieChartType
} from '$lib/chart-builder/pie-chart-builder/pie-chart-builder-factory';
import type { Period } from '$lib/entities/period';
import type { EventModel } from '$lib/entities/event';
import {
	LineChartBuilderFactory,
	type LineChartDataParams,
	type LineChartOptionParams,
	type LineChartType
} from '$lib/chart-builder/line-chart-builder/line-chart-builder-factory';

export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter' | 'area';
export type ChartSubtype = PieChartType;


export type ChartDataParams = PieChartDataParams | LineChartDataParams
export type ChartOptionParams = PieChartOptionParams | LineChartOptionParams;

export interface ChartBuilder<T, U> {
	generateParams(period: Period | null, events: EventModel[]): {optionParams: T, dataParams: U};
	buildOptions(params: T): ChartOption;
	buildData(params: U): ChartData;
}

export class ChartBuilderFactory<T extends ChartOptionParams, U extends ChartDataParams> implements ChartBuilder<T, U> {
	private chartBuilder: ChartBuilder<T, U>;

	constructor(private chartType: ChartType, private chartSubtype: ChartSubtype) {
		switch (this.chartType) {
			case 'line':
				this.chartBuilder = new LineChartBuilderFactory<T, U>(this.chartSubtype as LineChartType);
				break;
			default:
				this.chartBuilder = new PieChartBuilderFactory<T, U>(this.chartSubtype as PieChartType);
				break;
		}
	}

	buildOptions(params: any): ChartOption {
		return this.chartBuilder.buildOptions(params);
	}

	buildData(params: any): ChartData {
		return this.chartBuilder.buildData(params);
	}

	generateParams(period: Period | null, events: EventModel[]): {optionParams: T, dataParams: U} {
		return this.chartBuilder.generateParams(period, events);
	}
}