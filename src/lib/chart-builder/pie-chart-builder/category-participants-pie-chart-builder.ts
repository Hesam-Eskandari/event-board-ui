import type { EventModel } from '$lib/entities/event';
import type { ChartBuilder } from '$lib/chart-builder/chart-builder';
import type { Period } from '$lib/entities/period';
import { DateTimeHelper } from '$lib/utils/date-time';
import type { ChartOption } from '$lib/types/types';


export interface CatPartPieChartOptionParams {
	title: string;
	subtitle: string;
}

export type CatPartPieChartDataParams = EventModel[];

export class CategoriesParticipantPieChartBuilder<T extends CatPartPieChartOptionParams, U extends CatPartPieChartDataParams> implements ChartBuilder<T, U> {

	generateParams(period:Period | null, events:EventModel[]):{optionParams: T; dataParams: U} {
		const optionParams = {title: 'Participants', subtitle: period === null ? 'Period' : DateTimeHelper.getShortTextDuration(period.duration)} as T;
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
		const totalDurationOfParticipants: {[key: string]: {name: string; value: number}} =  {};
		(events as EventModel[]).map(event => ({participant: event.participant, duration: DateTimeHelper.calcDurationMinutes(event.start, event.end)}))
			.forEach(ev => {
				ev.participant.id! in totalDurationOfParticipants ? totalDurationOfParticipants[ev.participant.id!].value += ev.duration : totalDurationOfParticipants[ev.participant.id!] = {name: `${ev.participant.firstname} ${ev.participant.lastname}`, value: ev.duration};
			});
		if (Object.keys(totalDurationOfParticipants).length === 0) {
			return [];
		}
		const arr = Object.values(totalDurationOfParticipants)
			.sort((a, b) => b.value - a.value)
			.map(ev => [ev.name, ev.value]);
		return [
			['name', 'value', 'percentage'],
			...arr
		]
	}
}