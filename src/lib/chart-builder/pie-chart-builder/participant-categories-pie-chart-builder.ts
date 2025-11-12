import type { EventModel } from '$lib/entities/event';
import { DateTimeHelper } from '$lib/utils/date-time';
import type { ChartOption } from '$lib/types/types';
import type { ChartBuilder } from '$lib/chart-builder/chart-builder';
import type { Period } from '$lib/entities/period';

export interface PartCatPieChartOptionParams {
	title: string;
	subtitle: string;
}

export type PartCatPieChartDataParams = EventModel[];


export class ParticipantCategoriesPieChartBuilder<T extends PartCatPieChartOptionParams, U extends PartCatPieChartDataParams> implements ChartBuilder<T, U> {

	generateParams(period:Period | null, events:EventModel[]):{optionParams: T; dataParams: U} {
		const optionParams = {title: 'Categories', subtitle: period === null ? 'Period' : DateTimeHelper.getShortTextDuration(period.duration)} as T;
		const dataParams = events as U;
		return {optionParams, dataParams};
	}

	buildOptions(params: T): ChartOption {
		return {
			title: {
				text: params.title,
				subtext: params.subtitle,
				left: 'center'
			},
			tooltip: {
				trigger: 'item'
			},
			legend: {
				orient: 'vertical',
				left: 'left'
			},
			series: [
				{
					name: 'Minutes Spent in Categories',
					type: 'pie',
					radius: '50%',
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]
		};
	}

	buildData(events: U): (string | number | null)[][] {
		const totalDurationOfCategories: {[key: string]: {name: string; value: number}} =  {};
		(events as EventModel[]).map(event => ({category: event.category, duration: DateTimeHelper.calcDurationMinutes(event.start, event.end)}))
			.forEach(ev => {
				ev.category.id! in totalDurationOfCategories ? totalDurationOfCategories[ev.category.id!].value += ev.duration : totalDurationOfCategories[ev.category.id!] = {name: ev.category.title, value: ev.duration};
			});
		if (Object.keys(totalDurationOfCategories).length === 0) {
			return [];
		}
		const arr = Object.values(totalDurationOfCategories)
			.sort((a, b) => b.value - a.value)
			.map(ev => [ev.name, ev.value]);
		return [
			['name', 'value', 'percentage'],
			...arr
		]
	}
}