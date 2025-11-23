import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { TokenSnapshotStore } from '$lib/store/token.snapshot.store';


export const load = async ({ parent }) => {
	await parent();
	if (browser) {
		const token = TokenSnapshotStore.getToken();
		if (token == null) {
			throw redirect(303, `/`);
		}
	}
	return {};
};
