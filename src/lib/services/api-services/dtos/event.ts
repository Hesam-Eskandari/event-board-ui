import type { CategoryReadDTO } from '$lib/services/api-services/dtos/category';
import type { ParticipantReadDTO } from '$lib/services/api-services/dtos/participant';

export interface EventCreateDTO {
	title: string;
	start: string;
	end: string;
	categoryId: string;
	participantId: string;
}

export interface EventReadDTO {
	id: string;
	title: string;
	start: string;
	end: string;
	category: CategoryReadDTO;
	participant: ParticipantReadDTO;
}

export interface EventUpdateDTO {
	title: string | undefined;
	start: string | undefined;
	end: string | undefined;
	categoryId: string | undefined;
	participantId: string | undefined;
}
