import type { TenantService } from '$lib/services/tenant.service';
import type { Subscription } from '$lib/entities/subscription';
import type { DataStatus, Status } from '$lib/entities/data-status';
import { derived, writable, type Writable } from 'svelte/store';
import { TenantApiService } from '$lib/services/api-services/tenantApi.service';
import { TokenStore } from '$lib/store/token.store';

class TenantState implements DataStatus<TenantModel | null> {
	error: Error | null = null;
	data: TenantModel | null = null;
	status: Status = 'never';
}

export class TenantStore implements TenantService {
	private state: Writable<TenantState> = writable(new TenantState());
	private static instance: TenantStore | null = null;
	private apiService: TenantService = new TenantApiService();
	private stateFetchStatus: Status = 'never';
	
	private constructor() {}
	
	static getInstance(): TenantStore {
		if (TenantStore.instance === null) {
			TenantStore.instance = new TenantStore();
		}
		return TenantStore.instance;
	}
	
	createTenant(): Subscription<DataStatus<TenantModel | null>> {
		this.state.update((state) => {
			state.status = 'loading';
			state.error = null;
			state.data = null;
			return state;
		});
		this.apiService.createTenant().subscribe((ds: DataStatus<TenantModel | null>) => {
			this.state.update(() => ({
				error: ds.error,
				data: ds.data,
				status: ds.status
			}));
		})();
		return derived(this.state, ($state, set) => set($state));
	}

	getTenant(token?: string): Subscription<DataStatus<TenantModel | null>> {
		if (token === undefined) {
			const tokenStore = TokenStore.getInstance();
			const inferredToken = tokenStore.getTokenSnapshot();
			if (inferredToken === null) {
				return derived(this.state, ($state, set) => set($state));
			}
			token = inferredToken;
		}
		if (this.stateFetchStatus === 'loading' || this.stateFetchStatus === 'success') {
			return derived(this.state, ($state, set) => set($state));
		}
		this.stateFetchStatus = 'loading';
		this.state.update((state) => {
			state.status = 'loading';
			state.error = null;
			return state;
		});
		this.apiService.getTenant(token).subscribe((ds: DataStatus<TenantModel | null>) => {
			this.state.update(() => ({
				error: ds.error,
				data: ds.data,
				status: ds.status
			}));
			this.stateFetchStatus = ds.status;
		})();
		return derived(this.state, ($state, set) => set($state));
	}

	destroy() {
		this.stateFetchStatus = 'never';
		this.state.update((state: TenantState) => {
			state.data = null;
			state.error = null;
			state.status = 'never';
			return state;
		});
	}
}