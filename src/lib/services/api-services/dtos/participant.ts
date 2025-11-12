export interface ParticipantReadDTO {
	id: string;
	firstname: string;
	lastname: string;
	imageUrl: string;
	createdAt: string;
}

export interface ParticipantCreateDTO {
	firstname: string;
	lastname: string;
	imageUrl: string;
}

export interface ParticipantUpdateDTO {
	firstname: string | undefined;
	lastname: string | undefined;
	imageUrl: string | undefined;
}
