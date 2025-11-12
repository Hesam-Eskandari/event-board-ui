import type { ParticipantModel } from '$lib/entities/participant';
import { derived, type Writable, writable } from 'svelte/store';
import type { DataStatus, Status } from '$lib/entities/data-status';
import type { Subscription } from '$lib/entities/subscription';
import type { ParticipantService } from '$lib/services/participant.service';
import { ParticipantApiService } from '$lib/services/api-services/participantApi.service';

class ParticipantState implements DataStatus<ParticipantModel[]>{
		error: Error | null = null;
		data: ParticipantModel[] = [];
		status: Status = 'success';
}

export class ParticipantStore implements ParticipantService {
	private static instance: ParticipantStore | null = null;
	private state: Writable<ParticipantState> = writable(new ParticipantState());
	private apiService: ParticipantService = new ParticipantApiService();
	private constructor() {}

	static getInstance(): ParticipantStore {
		if (ParticipantStore.instance === null) {
			ParticipantStore.instance = new ParticipantStore();
		}
		return ParticipantStore.instance;
	}

	getParticipants(): Subscription<DataStatus<ParticipantModel[]>> {
		this.state.update((state) => {
			state.status = 'loading';
			state.error = null;
			return state;
		});
		this.apiService.getParticipants().subscribe((ds: DataStatus<ParticipantModel[]>) => {
			this.state.update(() => ({
				error: ds.error,
				data: ds.data,
				status: ds.status
			}));
		})();
		return derived(this.state, ($state, set) => set($state));
	}

	addParticipant(participant: ParticipantModel): Subscription<DataStatus<ParticipantModel | null>> {
		this.state.update((state) => {
			state.status = 'loading';
			state.error = null;
			return state;
		});
		let model: ParticipantModel | null = null;
		this.apiService
			.addParticipant(participant)
			.subscribe((ds: DataStatus<ParticipantModel | null>) => {
				this.state.update((state: ParticipantState): ParticipantState => {
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
			} as DataStatus<ParticipantModel | null>)
		);
	}

	deleteParticipant(participant: ParticipantModel): Subscription<Error | null> {
		this.state.update((state) => {
			state.status = 'loading';
			state.error = null;
			return state;
		});
		this.apiService.deleteParticipant(participant).subscribe((err: Error | null) => {
			this.state.update((state) => {
				state.data = state.data.filter((p) => p.id !== participant.id);
				return {
					...state,
					status: err !== null ? 'error' : 'success',
					error: err
				};
			});
		})();
		return derived(this.state, ($state, set) => set($state.error));
	}

	editParticipant(participant: ParticipantModel): Subscription<Error | null> {
		this.state.update(($state) => {
			$state.status = 'loading';
			$state.error = null;
			return $state;
		});
		this.apiService.editParticipant(participant)
			.subscribe((err: Error | null) => {
				this.state.update((state) => {
					if (err !== null) {
						return {
							...state,
							status: 'error',
							error: err
						};
					}
					const index = state.data.findIndex((p) => p.id === participant.id);
					if (index !== -1) {
						state.data[index] = participant;
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
