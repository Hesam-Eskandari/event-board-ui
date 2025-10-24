export function formatDateTime(date: Date): string {
	const year = date.toLocaleString('en-US', { year: 'numeric' });
	const month = date.toLocaleString('en-US', { month: 'short' }); // months start at 0
	const day = date.toLocaleString('en-US', { day: '2-digit' });
	const hours = date.toLocaleString('en-US', { hour: 'numeric', hourCycle: 'h23' });
	const minutes = date.toLocaleString('en-US', { minute: '2-digit'});
	const seconds = date.toLocaleString('en-US', { second: '2-digit' });
	const shortDay = date.toLocaleString('en-US', { weekday: 'short' });
	return `${shortDay} ${hours}:${minutes}:${seconds} (${year}-${month}-${day})`;
}

export function calcDuration(start: Date, end: Date): string {
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

export function calcDurationMinutes(start: Date, end: Date): number {
	const diff = end.getTime() - start.getTime();
	const minute = 1000 * 60;
	return Math.floor(diff / minute);
}

export function toDatetimeLocal(date: Date): string {
	const pad = (n: any) => n.toString().padStart(2, '0');
	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1);
	const day = pad(date.getDate());
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	return `${year}-${month}-${day}T${hours}:${minutes}`;
}