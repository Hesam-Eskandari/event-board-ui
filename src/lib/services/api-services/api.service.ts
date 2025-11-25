import { TokenStore } from '$lib/store/token.store';

export class ApiService {
	protected static tokenStore: TokenStore = TokenStore.getInstance();

	protected static addQParams(url: URL,  params: URLSearchParams): URL {
		params.entries().forEach(([key, value]) => {
			if (value != null) {
				url.searchParams.set(key, String(value));
			}
		});
		return url;
	}

	protected static getTokenQParam(): {token?: string} {
		const token = ApiService.tokenStore.getTokenSnapshot();
		return token !== null ? {token} : {};
	}

	protected static hasToken(params: URLSearchParams): boolean {
		return params.get('token') != null;
	}
}