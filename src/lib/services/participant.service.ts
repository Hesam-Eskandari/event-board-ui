import type { Subscription } from '$lib/entities/subscription';
import type { ParticipantModel } from '$lib/entities/participant';
import type { DataStatus } from '$lib/entities/dataStatus';

export interface ParticipantService {
	getParticipants(): Subscription<DataStatus<ParticipantModel[]>>;
	addParticipant(firstname: string, lastname: string, imageUrl: string): Subscription<DataStatus<ParticipantModel | null>>;
	deleteParticipant(participant: ParticipantModel): Subscription<Error | null>;
	editParticipant(participant: ParticipantModel): Subscription<Error | null>;
}