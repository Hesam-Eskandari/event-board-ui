import type { ChartBuilder } from '$lib/chart-builder/chart-builder';
import type { EventModel } from '$lib/entities/event';
import type { ChartData, ChartOption } from '$lib/types/types';
import type { Period } from '$lib/entities/period';

export interface CatPartLineChartOptionParams {
	title: string;
	subtitle: string;
}

export type CatPartLineChartDataParams = EventModel[];

export class ParticipantCategoriesLineChartBuilder<T extends CatPartLineChartOptionParams, U extends CatPartLineChartDataParams> implements ChartBuilder<T, U> {
	buildData(params: U): ChartData {
		return undefined;
	}

	buildOptions(params: T): ChartOption {
		return undefined;
	}

	generateParams(period: Period | null, events: EventModel[]): { optionParams: T; dataParams: U } {
		return { dataParams: undefined, optionParams: undefined };
	}

}