import type { ChartBuilder } from '$lib/chart-builder/chart-builder';
import type { ChartData, ChartOption } from '$lib/types/types';
import {
	ParticipantCategoriesPieChartBuilder,
	type PartCatPieChartDataParams,
	type PartCatPieChartOptionParams
} from '$lib/chart-builder/pie-chart-builder/participant-categories-pie-chart-builder';
import type { EventModel } from '$lib/entities/event';
import type { Period } from '$lib/entities/period';
import  {
	CategoriesParticipantPieChartBuilder,
	type CatPartPieChartDataParams,
	type CatPartPieChartOptionParams
} from '$lib/chart-builder/pie-chart-builder/category-participants-pie-chart-builder';
import type {
	PartCatLineChartDataParams,
	PartCatLineChartOptionParams
} from '$lib/chart-builder/line-chart-builder/participant-categories-line-chart-builder';
import type {
	CatPartLineChartDataParams,
	CatPartLineChartOptionParams
} from '$lib/chart-builder/line-chart-builder/category-participants-line-chart-builder';

export type LineChartDataParams = PartCatLineChartDataParams | CatPartLineChartDataParams;
export type LineChartOptionParams = PartCatLineChartOptionParams | CatPartLineChartOptionParams;
export type LineChartType = 'person-category' | 'category-person';


export class LineChartBuilderFactory<T extends LineChartOptionParams, U extends LineChartDataParams> implements ChartBuilder<T, U> {
	private chartBuilder: ChartBuilder<T, U>;
	constructor(private chartType: LineChartType) {
		switch (this.chartType) {
			case 'category-person':
				this.chartBuilder = new CategoriesParticipantPieChartBuilder<T, U>();
				break;
			default:
				this.chartBuilder = new ParticipantCategoriesPieChartBuilder<T, U>();
				break;
		}
	}

	buildData(params: any): ChartData {
		return this.chartBuilder.buildData(params);
	}

	buildOptions(params: any): ChartOption {
		return this.chartBuilder.buildOptions(params);
	}

	generateParams(period: Period | null, events: EventModel[]): { optionParams: T; dataParams: U } {
		return this.chartBuilder.generateParams(period, events);
	}
}
