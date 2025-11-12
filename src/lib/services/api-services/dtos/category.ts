export interface CategoryReadDTO {
	title: string;
	id: string;
}

export interface CategoryCreateDTO {
	title: string;
}

export interface CategoryUpdateDTO {
	title: string | undefined;
}
