import type { EChartsOption, EChartsType } from 'echarts';

export type Echarts = typeof import('echarts');
export type ChartOption = EChartsOption;
export type ChartData = (number | string | null)[][];
export type Chart = EChartsType;