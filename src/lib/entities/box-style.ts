export class BoxStyle {
	private margin: string = '0';
	private padding: string = '0';
	private width: string='100%'
	private height: string='100%'

	constructor() {
	}

	setWidth(width: string): this {
		this.width = width;
		return this;
	}

	setHeight(height: string): this {
		this.height = height;
		return this;
	}

	setMargin(margin: string): this {
		this.margin = margin;
		return this;
	}

	setPadding(padding: string): this {
		this.padding = padding;
		return this;
	}

	getWidth(): string {
		return this.width;
	}

	getHeight(): string {
		return this.height;
	}

	getMargin(): string {
		return this.margin;
	}

	getPadding(): string {
		return this.padding;
	}
}
