import type { EChartsOption, EChartsType } from 'echarts';

export type Echarts = typeof import('echarts');
export type ChartOption = EChartsOption;
export type ChartData = (number | string | null)[][];
export type Chart = EChartsType;

export type Position =
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right'
	| 'top'
	| 'right'
	| 'bottom'
	| 'left';
