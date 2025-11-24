import { derived, type Writable, writable } from 'svelte/store';
import type { DataStatus, Status } from '$lib/entities/data-status';
import type { Subscription } from '$lib/entities/subscription';
import type { EventModel } from '$lib/entities/event';
import { EventApiService } from '$lib/services/api-services/eventApi.service';
import type { EventService } from '$lib/services/event.service';

class EventState implements DataStatus<EventModel[]>{
	error: Error | null = null;
	data: EventModel[] = [];
	status: Status = 'success';
}

export class EventStore implements EventService {
	private static instance: EventStore | null = null;
	private state: Writable<EventState> = writable(new EventState());
	private stateFetchStatus: Status | 'never' = 'never';
	private apiService: EventService = new EventApiService();
	private constructor() {}

	static getInstance(): EventStore {
		if (EventStore.instance === null) {
			EventStore.instance = new EventStore();
		}
		return EventStore.instance;
	}

	getEvents(): Subscription<DataStatus<EventModel[]>> {
		if (this.stateFetchStatus === 'loading' || this.stateFetchStatus === 'success') {
			return derived(this.state, ($state, set) => set($state));
		}
		this.stateFetchStatus = 'loading';
		this.state.update((state) => {
			state.status = 'loading';
			state.error = null;
			return state;
		});
		this.apiService.getEvents().subscribe((ds: DataStatus<EventModel[]>) => {
			this.state.update(() => ({
				error: ds.error,
				data: ds.data,
				status: ds.status
			}));
			this.stateFetchStatus = ds.status;
		})();
		return derived(this.state, ($state, set) => set($state));
	}

	addEvent(event: EventModel): Subscription<DataStatus<EventModel | null>> {
		this.state.update((state) => {
			state.status = 'loading';
			state.error = null;
			return state;
		});
		let model: EventModel | null = null;
		this.apiService
			.addEvent(event)
			.subscribe((ds: DataStatus<EventModel | null>) => {
				this.state.update((state: EventState): EventState => {
					state.error = ds.error;
					if (ds.error !== null) {
						state.status = 'error';
					} else {
						state.status = 'success';
						state.data = [...state.data, ds.data!];
						model = ds.data!;
					}
					return state;
				});
			})();
		return derived(this.state, ($state, set) =>
			set({
				data: model,
				error: $state.error,
				status: $state.status
			} as DataStatus<EventModel | null>)
		);
	}

	deleteEvent(event: EventModel): Subscription<Error | null> {
		this.state.update((state) => {
			state.status = 'loading';
			state.error = null;
			return state;
		});
		this.apiService.deleteEvent(event).subscribe((err: Error | null) => {
			this.state.update((state) => {
				state.data = state.data.filter((p) => p.id !== event.id);
				return {
					...state,
					status: err !== null ? 'error' : 'success',
					error: err
				};
			});
		})();
		return derived(this.state, ($state, set) => set($state.error));
	}

	editEvent(event: EventModel): Subscription<Error | null> {
		this.state.update(($state) => {
			$state.status = 'loading';
			$state.error = null;
			return $state;
		});
		this.apiService.editEvent(event)
			.subscribe((err: Error | null) => {
				this.state.update((state) => {
					if (err !== null) {
						return {
							...state,
							status: 'error',
							error: err
						};
					}
					const index = state.data.findIndex((p) => p.id === event.id);
					if (index !== -1) {
						state.data[index] = event;
						state.data = [...state.data];
					}
					return {
						...state,
						status: 'success',
						error: err
					};
				})
			})();
		return derived(this.state, ($state, set) => set($state.error));
	}
}
