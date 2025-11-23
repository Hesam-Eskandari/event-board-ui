import type { Subscription } from '$lib/entities/subscription';
import type { DataStatus } from '$lib/entities/data-status';

export interface TenantService {
	getTenant(token: string): Subscription<DataStatus<TenantModel | null>>;
	createTenant(): Subscription<DataStatus<TenantModel | null>>;
}
