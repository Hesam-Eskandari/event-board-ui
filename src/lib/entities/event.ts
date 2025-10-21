import type { ParticipantModel } from '$lib/entities/participant';
import type { CategoryModel } from '$lib/entities/category';

export interface EventModel {
	id: string | null;
	title: string;
	start: Date;
	end: Date;
	category: CategoryModel;
	participant: ParticipantModel;
}
