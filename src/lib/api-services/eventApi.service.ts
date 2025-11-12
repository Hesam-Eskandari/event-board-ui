import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { EventService } from '$lib/services/event.service';
import type { Subscription } from '$lib/entities/subscription';
import type { DataStatus } from '$lib/entities/data-status';
import type { EventModel } from '$lib/entities/event';
import { PUBLIC_BASE_API_URL } from '$env/static/public';
import type { EventCreateDTO, EventReadDTO, EventUpdateDTO } from '$lib/api-services/dtos/event';
import type { CategoryModel } from '$lib/entities/category';

export class EventApiService implements EventService {
	addEvent(event: EventModel): Subscription<DataStatus<EventModel | null>> {
		return {
			subscribe(run:Subscriber<DataStatus<EventModel | null>>, invalidate?:() => void):Unsubscriber {
				invalidate?.()
				const url: string = `${PUBLIC_BASE_API_URL}/events`;
				const dto: EventCreateDTO = {
					title: event.title,
					start: event.start.toISOString(),
					end: event.end.toISOString(),
					categoryId: event.category.id,
					participantId: event.participant.id
				} as EventCreateDTO;
				fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dto)
				}).then(async (res: Response) => {
						if (!res.ok) {
							throw new Error(`Failed: ${res.status}`);
						}
						const dataDto = await res.json();
						const data = {
							...dataDto,
							start: new Date(dataDto.start),
							end: new Date(dataDto.end)
						}
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
		return {
			subscribe(run, invalidate) {
				invalidate?.();
				const url: string = `${PUBLIC_BASE_API_URL}/events/${event.id}`;
				fetch(url, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					},
				}).then(async (res: Response) => {
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
		return {
			subscribe(run: Subscriber<Error | null>, invalidate?: () => void): Unsubscriber {
				invalidate?.();
				const url: string = `${PUBLIC_BASE_API_URL}/events/${event.id}`;
				const dto: EventUpdateDTO = {
					title: event.title,
					start: event.start.toISOString(),
					end: event.end.toISOString(),
					categoryId: event.category.id,
					participantId: event.participant.id
				} as EventUpdateDTO;

				fetch(url, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dto)
				}).then(async (res: Response) => {
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
		return {
			subscribe(run, invalidate) {
				invalidate?.();
				const url: string = `${PUBLIC_BASE_API_URL}/events`;
				fetch(url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
				}).then(async (res: Response) => {
						if (!res.ok) {
							throw new Error(`Failed: ${res.status}`);
						}
						const raw: EventReadDTO[] = await res.json();
						const data: EventModel[] = raw.map((dto: EventReadDTO) => ({
							id: dto.id,
							start: new Date(dto.start),
							end: new Date(dto.end),
							title: dto.title,
							category: {
								id: dto.category.id,
								title: dto.category.title
							} as CategoryModel,
							participant: {
								id: dto.participant.id,
								firstname: dto.participant.firstname,
								lastname: dto.participant.lastname,
								imageUrl: dto.participant.imageUrl
							}
						}));
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
	private static events: EventModel[] = [
		{
			category: {
				title: "Chores",
				id: "2"
			},
			participant: {
				firstname: "Hesam",
				lastname: "Eskandari",
				imageUrl: "https://media.licdn.com/dms/image/v2/D5603AQEPI9bIXOcaYA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726718100271?e=1762387200&v=beta&t=mE9DRFq7sR0dB_b49vvCuISueR6wL4ttV99a29eqZA8",
				"id": "1"
			},
			start: new Date("2025-10-22T01:00:00.000Z"),
			end: new Date("2025-10-22T05:00:00.000Z"),
			title: "Baking Bread",
			id: "1"
		},
		{
			category: {
				title: "Personal Development",
				id: "1"
			},
			participant: {
				firstname: "Mahsa",
				lastname: "Aghajani",
				imageUrl: "https://media.licdn.com/dms/image/v2/C4D03AQGurYN5tfBfig/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1543775824818?e=1762387200&v=beta&t=sYm8CgzBhOvdYcvSwIE2OG5m_wo35J6cgRixxT2dkuk",
				id: "2"
			},
			start: new Date("2025-10-21T01:00:00.000Z"),
			end: new Date("2025-10-21T02:30:00.000Z"),
			title: "Gym",
			id: "2"
		},
		{
			category: {
				title: "Personal Development",
				id: "1"
			},
			participant: {
				firstname: "Hesam",
				lastname: "Eskandari",
				imageUrl: "https://media.licdn.com/dms/image/v2/D5603AQEPI9bIXOcaYA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726718100271?e=1762387200&v=beta&t=mE9DRFq7sR0dB_b49vvCuISueR6wL4ttV99a29eqZA8",
				"id": "1"
			},
			start: new Date("2025-10-22T01:00:00.000Z"),
			end: new Date("2025-10-22T02:30:00.000Z"),
			title: "Gym",
			id: "3"
		},{
			category: {
				title: "Chilling",
				id: "3"
			},
			participant: {
				firstname: "Hesam",
				lastname: "Eskandari",
				imageUrl: "https://media.licdn.com/dms/image/v2/D5603AQEPI9bIXOcaYA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726718100271?e=1762387200&v=beta&t=mE9DRFq7sR0dB_b49vvCuISueR6wL4ttV99a29eqZA8",
				id: "1"
			},
			start: new Date("2025-10-24T01:41:00.000Z"),
			end: new Date("2025-10-24T02:41:00.000Z"),
			title: "TV",
			id: "4"
		},{
			category: {
				title: "Personal Development",
				id: "1"
			},
			participant: {
				firstname: "Hesam",
				lastname: "Eskandari",
				imageUrl: "https://media.licdn.com/dms/image/v2/D5603AQEPI9bIXOcaYA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726718100271?e=1762387200&v=beta&t=mE9DRFq7sR0dB_b49vvCuISueR6wL4ttV99a29eqZA8",
				id: "1"
			},
			start: new Date("2025-10-24T01:41:00.000Z"),
			end: new Date("2025-10-24T02:41:00.000Z"),
			title: "Coding",
			id: "5"
		},{
			category: {
				title: "Chilling",
				id: "3"
			},
			participant: {
				firstname: "Hesam",
				lastname: "Eskandari",
				imageUrl: "https://media.licdn.com/dms/image/v2/D5603AQEPI9bIXOcaYA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726718100271?e=1762387200&v=beta&t=mE9DRFq7sR0dB_b49vvCuISueR6wL4ttV99a29eqZA8",
				id: "1"
			},
			start: new Date("2025-10-12T01:41:00.000Z"),
			end: new Date("2025-10-12T02:41:00.000Z"),
			title: "Gaming",
			id: "6"
		}
	];
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