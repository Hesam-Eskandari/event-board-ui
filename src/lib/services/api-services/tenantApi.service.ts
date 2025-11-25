import type { TenantService } from '$lib/services/tenant.service';
import { PUBLIC_BASE_API_URL } from '$env/static/public';
import type { Subscription } from '$lib/entities/subscription';
import type { DataStatus } from '$lib/entities/data-status';
import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { TenantReadDTO } from '$lib/services/api-services/dtos/tenant';
import { ApiService } from '$lib/services/api-services/api.service';

export class TenantApiService extends ApiService implements TenantService {
	
	getTenant(token: string):Subscription<DataStatus<TenantModel | null>> {
		return {
			subscribe(run: Subscriber<DataStatus<TenantModel | null>>, invalidate?: () => void): Unsubscriber {
				invalidate?.();
				const params = new URLSearchParams({
					token
				});
				if (!TenantApiService.hasToken(params)) {
					run({data: null, error: new Error('token not found: cannot get workspace info without a workspace token'), status: 'error'});
					return () => {};
				}
				const url = TenantApiService.addQParams(new URL(`${PUBLIC_BASE_API_URL}/tokens/${token}`), params);
				fetch(url)
					.then(async(res: Response) => {
						if (!res.ok) {
							throw new Error(`failed getting tenant`);
						}
						const dto: TenantReadDTO = await res.json();
						// TODO: remove this line once backend supports tags
						dto.tag = 'Home';
						const data = dto as TenantModel;
						run({data, error: null, status: 'success'});
					})
					.catch((error: Error) => {
						run({data: null, error, status: 'error'})
					});

				return () => {};
			}
		};
	}

	createTenant(): Subscription<DataStatus<TenantModel | null>> {
		return {
			subscribe(run: Subscriber<DataStatus<TenantModel | null>>, invalidate?: () => void): Unsubscriber {
				invalidate?.();
				const params = new URLSearchParams({
					...TenantApiService.getTokenQParam()
				});
				if (TenantApiService.hasToken(params)) {
					run({data: null, error: new Error('failed generating workspace. workspace is already loaded.'), status: 'error'});
					return () => {};
				}
				const url = TenantApiService.addQParams(new URL(`${PUBLIC_BASE_API_URL}/tokens/`), params);
				fetch(url, {
					method: 'POST'
				}).then(async(res: Response) => {
					if (!res.ok) {
						throw new Error('failed creating a workspace');
					}
					const dto: TenantReadDTO = await res.json();
					const data: TenantModel = dto as TenantModel;
					run({data, error: null, status: 'success'});
				}).catch((error: Error) => {
					run({data: null, error, status: 'error' });
				});
				return () => {};
			}
		};
	}
}