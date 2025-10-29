import type { Subscription } from '$lib/entities/subscription';
import type { ParticipantModel } from '$lib/entities/participant';
import type { DataStatus } from '$lib/entities/data-status';

export interface ParticipantService {
	getParticipants(): Subscription<DataStatus<ParticipantModel[]>>;
	addParticipant(participant: ParticipantModel): Subscription<DataStatus<ParticipantModel | null>>;
	deleteParticipant(participant: ParticipantModel): Subscription<Error | null>;
	editParticipant(participant: ParticipantModel): Subscription<Error | null>;
}