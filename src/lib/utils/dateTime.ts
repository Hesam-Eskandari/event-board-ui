import type { Period } from '$lib/entities/period';
import type { Duration } from '$lib/entities/duration';


export class DateTimeHelper {

	static second: number = 1000;
	static minute: number = 60 * DateTimeHelper.second;
	static hour: number = 60 * DateTimeHelper.minute;
	static day: number = 24 * DateTimeHelper.hour;
	static week: number = 7 * DateTimeHelper.day;
	static month: number = 30 * DateTimeHelper.day;
	static year: number = 365 * DateTimeHelper.day;

	static formatDateTime(date: Date): string {
		const year = date.toLocaleString('en-US', { year: 'numeric' });
		const month = date.toLocaleString('en-US', { month: 'short' }); // months start at 0
		const day = date.toLocaleString('en-US', { day: '2-digit' });
		const hours = date.toLocaleString('en-US', { hour: 'numeric', hourCycle: 'h24' });
		const minutes = date.toLocaleString('en-US', { minute: '2-digit'});
		const seconds = date.toLocaleString('en-US', { second: '2-digit' });
		const shortDay = date.toLocaleString('en-US', { weekday: 'short' });
		return `${shortDay} ${hours}:${minutes}:${seconds} (${year}-${month}-${day})`;
	}

	static calcDuration(start: Date, end: Date): string {
		const diff = end.getTime() - start.getTime();
		const hour = 1000 * 60 * 60;
		const minute = 1000 * 60;
		let res = '';
		const hours = Math.floor(diff / hour);
		if (hours > 0) {
			res += `${hours}h `;
		}
		const minutes = Math.floor((diff % hour) / minute);
		if (minutes > 0) {
			res += `${minutes}m `;
		}
		const seconds = Math.floor((diff % minute) / 1000);
		if (seconds > 0) {
			res += `${seconds}s`;
		}
		return res;
	}

	static calcDurationMinutes(start: Date, end: Date): number {
		const diff = end.getTime() - start.getTime();
		const minute = 1000 * 60;
		return Math.floor(diff / minute);
	}

	static toDatetimeLocal(date: Date): string {
		const pad = (n: any) => n.toString().padStart(2, '0');
		const year = date.getFullYear();
		const month = pad(date.getMonth() + 1);
		const day = pad(date.getDate());
		const hours = pad(date.getHours());
		const minutes = pad(date.getMinutes());
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}

	static buildPeriods(end: Date = new Date()): Period[] {
		return [
			{
				name: 'Today',
				id: 'day',
				duration: {
					end,
					start: new Date(end.getFullYear(), end.getMonth(), end.getDate())
				}
			},
			{
				name: 'This Week',
				id: 'week',
				duration: {
					end,
					start: new Date(end.getFullYear(), end.getMonth(), end.getDate() - end.getDay())
				}
			},
			{
				name: '7 Days',
				id: '7d',
				duration: {
					end,
					start: new Date(end.getTime() - DateTimeHelper.week)
				}
			},
			{
				name: end.toLocaleString('en-US', { month: 'long' }),
				id: 'month',
				duration: {
					end,
					start: new Date(end.getFullYear(), end.getMonth(), 1)
				}
			},
			{
				name: DateTimeHelper.getSeason(end),
				id: 'season',
				duration: DateTimeHelper.getSeasonDuration(end)[0]!
			},
			{
				name: DateTimeHelper.getQuarter(end),
				id: 'quarter',
				duration: {
					end,
					start: new Date(end.getFullYear(), end.getMonth() - (end.getMonth() % 3), 1)
				}
			},
			{
				name: `${end.getFullYear()}`,
				id: 'year',
				duration: {
					end,
					start: new Date(end.getFullYear(), 0, 1)
				}
			}
		];
	}

	static getQuarter(date: Date): string {
		const month = date.getMonth();
		if (month < 3) {
			return 'Q1';
		} else if (month < 6) {
			return 'Q2';
		} else if (month < 9) {
			return 'Q3';
		} else {
			return 'Q4';
		}
	}

	static getSeason(date: Date): string {
		const month = date.getMonth();
		if (month === 11 || month === 0 || month === 1) {
			return 'Winter';
		}
		if (month >= 2 && month <= 4) {
			return 'Spring';
		}
		if (month >= 5 && month <= 7) {
			return 'Summer';
		}
		return 'Fall';
	}

	static getSeasonDuration(date: Date = new Date()): [Duration | null, Error | null]  {
		const year = date.getFullYear();

		const springStart_Y = new Date(year, 2, 21);
		const summerStart_Y = new Date(year, 5, 22);
		const fallStart_Y = new Date(year, 8, 23);
		const winterStart_Y = new Date(year, 11, 23);

		if (date >= springStart_Y && date < summerStart_Y) {
			return [{
				start: springStart_Y,
				end: new Date(year, 5, 21)
			}, null];
		}

		if (date >= summerStart_Y && date < fallStart_Y) {
			return [{
				start: summerStart_Y,
				end: new Date(year, 8, 22)
			}, null];
		}

		if (date >= fallStart_Y && date < winterStart_Y) {
			return [{
				start: fallStart_Y,
				end: new Date(year, 11, 22)
			}, null];
		}

		if (date >= winterStart_Y) {
			return [{
				start: winterStart_Y,
				end: new Date(year + 1, 2, 20)
			}, null];
		}

		const winterStart_Y_minus_1 = new Date(year - 1, 11, 23); // Dec 23, Y-1
		const winterEnd_Y = new Date(year, 2, 20); // Mar 20, Y

		if (date <= winterEnd_Y) {
			return [{
				start: winterStart_Y_minus_1,
				end: winterEnd_Y
			}, null];
		}
		return [null, new Error('Invalid date')];
	}
}
