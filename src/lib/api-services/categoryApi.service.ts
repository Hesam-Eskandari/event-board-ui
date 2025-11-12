import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { CategoryService } from '$lib/services/category.service';
import type { Subscription } from '$lib/entities/subscription';
import type { DataStatus } from '$lib/entities/data-status';
import type { CategoryModel } from '$lib/entities/category';
import { PUBLIC_BASE_API_URL } from '$env/static/public';
import type {
	CategoryCreateDTO,
	CategoryReadDTO,
	CategoryUpdateDTO
} from '$lib/api-services/dtos/category';

export class CategoryApiService implements CategoryService {
	addCategory(title: string): Subscription<DataStatus<CategoryModel | null>> {
		return {
			subscribe(run:Subscriber<DataStatus<CategoryModel | null>>, invalidate?:() => void):Unsubscriber {
				invalidate?.()
				const url: string = `${PUBLIC_BASE_API_URL}/categories/`;
				const dto: CategoryCreateDTO = {
					title: title
				} as CategoryCreateDTO;
				fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dto)
				}).then(async (res: Response) => {
						if (!res.ok) {
							throw new Error(`Failed: ${res.status}`);
						}
						const data: CategoryModel = await res.json();
						run({ data, error: null, status: 'success' });
					})
					.catch((err: Error) => {
						run({ data: null, error: err, status: 'error' });
					})
				return () => {};
			}
		}
	}

	deleteCategory(category: CategoryModel): Subscription<Error | null> {
		return {
			subscribe(run, invalidate) {
				invalidate?.();
				const url: string = `${PUBLIC_BASE_API_URL}/categories/${category.id}`;
				fetch(url, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					},
				}).then(async (res: Response) => {
						if (!res.ok) {
							throw new Error(`Failed: ${res.status}`);
						}
						run(null);
					})
					.catch((err) => {
						run(err);
					});

				// Unsubscriber (cleanup)
				return () => {};
			}
		};
	}

	editCategory(category: CategoryModel): Subscription<Error | null> {
		return {
			subscribe(run: Subscriber<Error | null>, invalidate?: () => void): Unsubscriber {
				invalidate?.();
				const url: string = `${PUBLIC_BASE_API_URL}/categories/${category.id}`;
				const dto: CategoryUpdateDTO = {
					title: category.title
				} as CategoryUpdateDTO;
				fetch(url, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dto)
				}).then(async (res: Response) => {
						if (!res.ok) {
							throw new Error(`Failed: ${res.status}`);
						}
						run(null);
					})
					.catch((err: Error) => {
						run(err);
					})
				return () => {};
			}
		};
	}

	getCategories(): Subscription<DataStatus<CategoryModel[]>> {
		return {
			subscribe(run, invalidate) {
				invalidate?.();
				const url: string = `${PUBLIC_BASE_API_URL}/categories/`;
				fetch(url,  {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(async (res: Response) => {
						if (!res.ok) {
							throw new Error(`Failed: ${res.status}`);
						}
						const raw: CategoryReadDTO[] = await res.json();
						const data = raw.map((dto: CategoryReadDTO) => ({
							title: dto.title,
							id: dto.id
						} as CategoryModel));
						run({ data, error: null, status: 'success' });
					})
					.catch((err) => {
						run({ data: [], error: err, status: 'error' });
					});

				// Unsubscriber (cleanup)
				return () => {};
			}
		};
	}
}

class MockCategoryDataProvider {
	private static categories: CategoryModel[] = [
		{title: 'Personal Development', id: '1'},
		{title: 'Chores', id: '2'},
		{title: 'Chilling', id: '3'},
		{title: 'Socializing', id: '4'},
		{title: 'Working', id: '5'},
	];
	getCategories(): CategoryModel[] {
		return [...MockCategoryDataProvider.categories];
	}

	addCategory(title: string): CategoryModel {
		const category = {title, id: (Math.random() * 1000).toString(36)} as CategoryModel;
		MockCategoryDataProvider.categories.push(category);
		return category;
	}

	deleteCategory(category: CategoryModel): Error | null {
		const found = MockCategoryDataProvider.categories.findIndex(cat => cat.id === category.id);
		if (found === -1) {
			return new Error(`failed deleting category, id ${category.id} not found`);
		}
		MockCategoryDataProvider.categories = MockCategoryDataProvider.categories.filter(cat => cat.id !== category.id);
		return null;
	}

	editCategory(category: CategoryModel): Error | null {
		const found = MockCategoryDataProvider.categories.findIndex(cat => cat.id === category.id);
		if (found === -1) {
			return new Error(`failed updating category, id ${category.id} not found`);
		}
		MockCategoryDataProvider.categories[found] = category;
		return null;
	}
}