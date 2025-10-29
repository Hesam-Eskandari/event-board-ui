import type { FilterConfig } from '$lib/entities/filter-config';
import { BoxStyle } from '$lib/entities/box-style';
import type { ChartData, ChartOption } from '$lib/types/types';

export class ChartUI extends BoxStyle {
	private isReadyToRender: boolean = false;
	private chartOption: ChartOption | null = null;
	private chartData: ChartData | null = null;

	setIsReadyToRender(isReadyToRender: boolean): this {
		this.isReadyToRender = isReadyToRender;
		return this;
	}

	getIsReadyToRender(): boolean {
		return this.isReadyToRender;
	}

	setChartOption(option: ChartOption | null): this {
		this.chartOption = option;
		return this;
	}

	getChartOption(): ChartOption | null {
		return this.chartOption;
	}

	setChartData(data: ChartData | null): this {
		this.chartData = data;
		return this;
	}

	getChartData(): ChartData | null {
		return this.chartData;
	}
}

export class ChartModel extends ChartUI {
	private id: string = Math.random().toString(36);
	private filterConfig: FilterConfig | null = null;

	private setIds(id: string): this {
		this.id = id;
		return this;
	}

	getId(): string {
		return this.id;
	}

	setFilterConfig(filterConfig: FilterConfig | null): this {
		this.filterConfig = filterConfig;
		return this;
	}

	getFilterConfig(): FilterConfig | null {
		return this.filterConfig;
	}

	clone(): ChartModel {
		const chart = new ChartModel();
		return chart.setIds(this.getId())
			.setChartData(this.getChartData())
			.setChartOption(this.getChartOption())
			.setFilterConfig(this.getFilterConfig())
			.setWidth(this.getWidth())
			.setHeight(this.getHeight())
			.setMargin(this.getMargin())
			.setPadding(this.getPadding())
			.setIsReadyToRender(this.getIsReadyToRender());
	}
}
