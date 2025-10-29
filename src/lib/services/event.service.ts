import type { Subscription } from '$lib/entities/subscription';
import type { DataStatus } from '$lib/entities/data-status';
import type { EventModel } from '$lib/entities/event';

export interface EventService {
	getEvents(): Subscription<DataStatus<EventModel[]>>;
	addEvent(event: EventModel): Subscription<DataStatus<EventModel | null>>;
	deleteEvent(event: EventModel): Subscription<Error | null>;
	editEvent(event: EventModel): Subscription<Error | null>;
}