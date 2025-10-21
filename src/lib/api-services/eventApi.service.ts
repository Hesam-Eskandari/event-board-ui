import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { EventService } from '$lib/services/event.service';
import type { Subscription } from '$lib/entities/subscription';
import type { DataStatus } from '$lib/entities/dataStatus';
import type { EventModel } from '$lib/entities/event';

export class EventApiService implements EventService {
	addEvent(event: EventModel): Subscription<DataStatus<EventModel | null>> {
		const mockDataProvider = new MockEventDataProvider();
		return {
			subscribe(run:Subscriber<DataStatus<EventModel | null>>, invalidate?:() => void):Unsubscriber {
				invalidate?.()
				Promise.resolve(new Response(JSON.stringify(mockDataProvider.addEvent(event))))
					.then(async (res: Response) => {
						if (!res.ok) {
							throw new Error(`Failed: ${res.status}`);
						}
						const data: EventModel = await res.json();
						run({ data, error: null, status: 'success' });
					})
					.catch((err: Error) => {
						run({ data: null, error: err, status: 'error' });
					})
				return () => {};
			}
		}
	}

	deleteEvent(event: EventModel): Subscription<Error | null> {
		const mockDataProvider = new MockEventDataProvider();
		return {
			subscribe(run, invalidate) {
				invalidate?.();
				const res = new Response(JSON.stringify(mockDataProvider.deleteEvent(event)));
				Promise.resolve(res)
					.then(async (res: Response) => {
						if (!res.ok) {
							throw new Error(`Failed: ${res.status}`);
						}
						run(null);
					})
					.catch((err) => {
						run(err);
					});

				// Unsubscriber (cleanup)
				return () => {};
			}
		};
	}

	editEvent(event: EventModel): Subscription<Error | null> {
		const mockDataProvider = new MockEventDataProvider();
		return {
			subscribe(run: Subscriber<Error | null>, invalidate?: () => void): Unsubscriber {
				invalidate?.();
				const res = new Response(JSON.stringify(mockDataProvider.editEvent(event)));
				Promise.resolve(res)
					.then(async (res: Response) => {
						if (!res.ok) {
							throw new Error(`Failed: ${res.status}`);
						}
						run(null);
					})
					.catch((err: Error) => {
						run(err);
					})
				return () => {};
			}
		};
	}

	getEvents(): Subscription<DataStatus<EventModel[]>> {
		const mockDataProvider = new MockEventDataProvider();
		return {
			subscribe(run, invalidate) {
				invalidate?.();
				const res = new Response(JSON.stringify(mockDataProvider.getEvents()));
				Promise.resolve(res)
					.then(async (res: Response) => {
						if (!res.ok) {
							throw new Error(`Failed: ${res.status}`);
						}
						const data: EventModel[] = await res.json();
						run({ data, error: null, status: 'success' });
					})
					.catch((err) => {
						run({ data: [], error: err, status: 'error' });
					});

				// Unsubscriber (cleanup)
				return () => {};
			}
		};
	}
}

class MockEventDataProvider {
	private static events: EventModel[] = [];
	getEvents(): EventModel[] {
		return [...MockEventDataProvider.events];
	}

	addEvent(event: EventModel): EventModel {
		event = {...event, id: (Math.random() * 1000).toString(36)} as EventModel;
		MockEventDataProvider.events.push(event);
		return event;
	}

	deleteEvent(event: EventModel): Error | null {
		const found = MockEventDataProvider.events.findIndex(cat => cat.id === event.id);
		if (found === -1) {
			return new Error(`failed deleting event, id ${event.id} not found`);
		}
		MockEventDataProvider.events = MockEventDataProvider.events.filter(cat => cat.id !== event.id);
		return null;
	}

	editEvent(event: EventModel): Error | null {
		const found = MockEventDataProvider.events.findIndex(cat => cat.id === event.id);
		if (found === -1) {
			return new Error(`failed updating event, id ${event.id} not found`);
		}
		MockEventDataProvider.events[found] = event;
		return null;
	}
}