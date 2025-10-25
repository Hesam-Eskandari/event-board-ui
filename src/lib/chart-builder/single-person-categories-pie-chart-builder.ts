import type { EventModel } from '$lib/entities/event';
import { DateTimeHelper } from '$lib/utils/dateTime';
import type { ChartOption } from '$lib/types/types';

export class SinglePersonCategoriesPieChartBuilder {
	buildOptions(title: string, subtitle: string): ChartOption {
		return {
			title: {
				text: title,
				subtext: subtitle,
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

	buildData(events: EventModel[]): (string | number | null)[][] {
		const totalDurationOfCategories: {[key: string]: {name: string; value: number}} =  {};
		events.map(event => ({category: event.category, duration: DateTimeHelper.calcDurationMinutes(event.start, event.end)}))
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