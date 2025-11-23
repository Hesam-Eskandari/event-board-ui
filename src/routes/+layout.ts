import { TokenSnapshotStore } from '$lib/store/token.snapshot.store';
import { browser } from '$app/environment';
import { TenantApiService } from '$lib/services/api-services/tenantApi.service';
import type { DataStatus } from '$lib/entities/data-status';

export const load = async ({ url }) => {
	if (browser) {
		const token = url.searchParams.get('token');
		const tenantService = new TenantApiService();
		let tenant: TenantModel | null = await new Promise((resolve) => {
			tenantService.getTenant(token).subscribe((ds: DataStatus<TenantModel | null>) => {
				resolve(ds.data);
			});
		});
		if (tenant != null) {
			TokenSnapshotStore.saveToken(token);
		}
	}
};