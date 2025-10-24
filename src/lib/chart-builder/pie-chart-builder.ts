import { type EChartsOption } from 'echarts';
import type { EventModel } from '$lib/entities/event';
import { calcDurationMinutes } from '$lib/utils/dateTime';

export class PieChartBuilder {
	buildOptions(title: string, subtitle: string): EChartsOption {
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
					name: 'Access From',
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
		events.map(event => ({category: event.category, duration: calcDurationMinutes(event.start, event.end)}))
			.forEach(ev => {
				ev.category.id! in totalDurationOfCategories ? totalDurationOfCategories[ev.category.id!].value += ev.duration : totalDurationOfCategories[ev.category.id!] = {name: ev.category.title, value: ev.duration};
			});
		const arr = Object.values(totalDurationOfCategories)
			.sort((a, b) => b.value - a.value)
			.map(ev => [ev.name, ev.value]);
		return [
			['Name', 'value', 'percentage'],
			...arr
		]
	}
}