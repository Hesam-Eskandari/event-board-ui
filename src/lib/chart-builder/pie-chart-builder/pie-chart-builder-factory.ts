import type { ChartBuilder } from '$lib/chart-builder/chart-builder';
import type { ChartData, ChartOption } from '$lib/types/types';
import {
	SinglePersonCategoriesPieChartBuilder,
	type SPCPieChartDataParams,
	type SPCPieChartOptionParams
} from '$lib/chart-builder/pie-chart-builder/single-person-categories-pie-chart-builder';
import type { EventModel } from '$lib/entities/event';
import type { Period } from '$lib/entities/period';

export type PieChartDataParams = SPCPieChartDataParams;
export type PieChartOptionParams = SPCPieChartOptionParams;
export type PieChartType = 'single-person-category';


export class PieChartBuilderFactory<T extends PieChartOptionParams, U extends PieChartDataParams> implements ChartBuilder<T, U> {
	private chartBuilder: ChartBuilder<T, U>;
	constructor(private pieChartType: PieChartType) {
		switch (this.pieChartType) {
			default:
				this.chartBuilder = new SinglePersonCategoriesPieChartBuilder<T, U>();
				break;
		}
	}

	buildData(params: any): ChartData {
		return this.chartBuilder.buildData(params);
	}

	buildOptions(params: any): ChartOption {
		return this.chartBuilder.buildOptions(params);
	}

	generateParams(period: Period | null, events: EventModel[]): { optionParams: any; dataParams: any } {
		return this.chartBuilder.generateParams(period, events);
	}
}
