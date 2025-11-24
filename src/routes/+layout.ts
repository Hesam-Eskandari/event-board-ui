import { TokenSnapshotStore } from '$lib/store/token.snapshot.store';
import { browser } from '$app/environment';
import type { DataStatus } from '$lib/entities/data-status';
import { TenantStore } from '$lib/store/tenant.store';
import type { TenantService } from '$lib/services/tenant.service';

export const load = async ({ url }) => {
	if (browser) {
		const token: string | null = url.searchParams.get('token');
		if (token == null) {
			return;
		}
		const tenantService: TenantService = TenantStore.getInstance();
		let tenant: TenantModel | null = await new Promise((resolve) => {
			tenantService.getTenant(token).subscribe((ds: DataStatus<TenantModel | null>) => {
				if (ds.status !== 'loading') {
					resolve(ds.data);
				}
			});
		});
		if (tenant != null) {
			TokenSnapshotStore.saveToken(token);
		}
	}
};