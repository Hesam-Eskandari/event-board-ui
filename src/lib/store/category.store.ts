import { derived, type Writable, writable } from 'svelte/store';
import type { CategoryService } from '$lib/services/category.service';
import type { DataStatus, Status } from '$lib/entities/data-status';
import type { Subscription } from '$lib/entities/subscription';
import type { CategoryModel } from '$lib/entities/category';
import { CategoryApiService } from '$lib/services/api-services/categoryApi.service';

class CategoryState implements DataStatus<CategoryModel[]>{
	error: Error | null = null;
	data: CategoryModel[] = [];
	status: Status = 'success';
}

export class CategoryStore implements CategoryService {
	private static instance: CategoryStore | null = null;
	private state: Writable<CategoryState> = writable(new CategoryState());
	private apiService: CategoryService = new CategoryApiService();
	private stateFetchStatus: Status | 'never' = 'never';
	private constructor() {}

	static getInstance(): CategoryStore {
		if (CategoryStore.instance === null) {
			CategoryStore.instance = new CategoryStore();
		}
		return CategoryStore.instance;
	}

	getCategories(): Subscription<DataStatus<CategoryModel[]>> {
		if (this.stateFetchStatus === 'loading' || this.stateFetchStatus === 'success') {
			return derived(this.state, ($state, set) => set($state));
		}
		this.stateFetchStatus = 'loading';
		this.state.update((state) => {
			state.status = 'loading';
			state.error = null;
			return state;
		});
		this.apiService.getCategories().subscribe((ds: DataStatus<CategoryModel[]>) => {
			this.state.update(() => ({
				error: ds.error,
				data: ds.data,
				status: ds.status
			}));
			this.stateFetchStatus = ds.status;
		})();
		return derived(this.state, ($state, set) => set($state));
	}

	addCategory(title: string): Subscription<DataStatus<CategoryModel | null>> {
		this.state.update((state) => {
			state.status = 'loading';
			state.error = null;
			return state;
		});
		let model: CategoryModel | null = null;
		this.apiService
			.addCategory(title)
			.subscribe((ds: DataStatus<CategoryModel | null>) => {
				this.state.update((state: CategoryState): CategoryState => {
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
			} as DataStatus<CategoryModel | null>)
		);
	}

	deleteCategory(participant: CategoryModel): Subscription<Error | null> {
		this.state.update((state) => {
			state.status = 'loading';
			state.error = null;
			return state;
		});
		this.apiService.deleteCategory(participant).subscribe((err: Error | null) => {
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

	editCategory(participant: CategoryModel): Subscription<Error | null> {
		this.state.update(($state) => {
			$state.status = 'loading';
			$state.error = null;
			return $state;
		});
		this.apiService.editCategory(participant)
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
