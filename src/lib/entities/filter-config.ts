import type { Position } from '$lib/types/types';

export type FilterType = 'dropdown';

export interface FilterConfig {
	id: string;
	type: FilterType;
	position: Position;
}
