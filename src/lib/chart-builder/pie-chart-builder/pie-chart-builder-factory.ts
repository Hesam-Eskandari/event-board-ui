import type { ChartBuilder } from '$lib/chart-builder/chart-builder';
import type { ChartData, ChartOption } from '$lib/types/types';
import {
	ParticipantCategoriesPieChartBuilder,
	type SPCPieChartDataParams,
	type SPCPieChartOptionParams
} from '$lib/chart-builder/pie-chart-builder/participant-categories-pie-chart-builder';
import type { EventModel } from '$lib/entities/event';
import type { Period } from '$lib/entities/period';
import  {
	CategoriesParticipantPieChartBuilder,
	type CatPartPieChartDataParams,
	type CatPartPieChartOptionParams
} from '$lib/chart-builder/pie-chart-builder/category-participants-pie-chart-builder';

export type PieChartDataParams = SPCPieChartDataParams | CatPartPieChartDataParams;
export type PieChartOptionParams = SPCPieChartOptionParams | CatPartPieChartOptionParams;
export type PieChartType = 'person-category' | 'category-person';


export class PieChartBuilderFactory<T extends PieChartOptionParams, U extends PieChartDataParams> implements ChartBuilder<T, U> {
	private chartBuilder: ChartBuilder<T, U>;
	constructor(private pieChartType: PieChartType) {
		switch (this.pieChartType) {
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
