import type { Subscription } from '$lib/entities/subscription';
import type { CategoryModel } from '$lib/entities/category';
import type { DataStatus } from '$lib/entities/dataStatus';

export interface CategoryService {
	getCategories(): Subscription<DataStatus<CategoryModel[]>>;
	addCategory(title: string): Subscription<DataStatus<CategoryModel | null>>;
	deleteCategory(category: CategoryModel): Subscription<Error | null>;
	editCategory(category: CategoryModel): Subscription<Error | null>;
}