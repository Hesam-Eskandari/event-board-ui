import type { ChartSubtype, ChartType } from '$lib/chart-builder/chart-builder';
import type { FilterConfig } from '$lib/entities/filter-config';

export interface DashboardItemConfig {
	id: string;
	type: ChartType;
	subtype: ChartSubtype;
	width: string;
	height: string;
	filterConfig: FilterConfig | null;
}
