import { derived, get, writable, type Writable } from 'svelte/store';
import type { Subscription } from '$lib/entities/subscription';

class TokenState {
	data: string | null = null;
}

export class TokenStore {
	private static instance: TokenStore | null = null;
	private state: Writable<TokenState> = writable<TokenState>(new TokenState());
	
	private constructor() {}
	
	static getInstance(): TokenStore {
		if (TokenStore.instance === null) {
			TokenStore.instance = new TokenStore();
		}
		return TokenStore.instance;
	}
	
	setToken(token: string | null): void {
		this.state.update((state) => {
			state.data = token;
			return state;
		});
	}

	getToken(): Subscription<string | null> {
		return derived(this.state, ($state, set) => set($state.data));
	}

	getTokenSnapshot(): string | null {
		return get(this.state).data;
	}
}
