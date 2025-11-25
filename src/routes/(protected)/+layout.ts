import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { TokenStore } from '$lib/store/token.store';


export const load = async ({ parent }) => {
	await parent();
	if (browser) {
		const token: string | null = TokenStore.getInstance().getTokenSnapshot();
		if (token == null) {
			throw redirect(303, `/`);
		}
	}
	return {};
};
