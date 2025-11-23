

export class TokenSnapshotStore {
	private static token: string | null = null;

	static saveToken(token: string | null) {
		TokenSnapshotStore.token = token;
	}

	static getToken(): string | null {
		return TokenSnapshotStore.token;
	}

	static getTokenQParam(): {token?: string} {
		return TokenSnapshotStore.token !== null ? {token: TokenSnapshotStore.token} : {};
	}

	static hasToken(params: URLSearchParams): boolean {
		return params.get('token') != null;
	}
}