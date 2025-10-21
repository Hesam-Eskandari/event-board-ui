import type { Subscriber, Unsubscriber } from 'svelte/store';

export interface Subscription<T> {
	subscribe(this: void, run: Subscriber<T>, invalidate?: () => void): Unsubscriber;
}
