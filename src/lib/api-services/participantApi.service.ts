import type { ParticipantService } from '$lib/services/participant.service';
import type { ParticipantModel } from '$lib/entities/participant';
import type { Subscription } from '$lib/entities/subscription';
import type { DataStatus } from '$lib/entities/data-status';
import type { Subscriber, Unsubscriber } from 'svelte/store';

export class ParticipantApiService implements ParticipantService {
	addParticipant(p:ParticipantModel): Subscription<DataStatus<ParticipantModel | null>> {
		const mockDataProvider = new MockParticipantDataProvider();
		return {
			subscribe: (run, invalidate) => {
				invalidate?.();
				Promise.resolve(new Response(JSON.stringify(mockDataProvider.addParticipant(p.firstname, p.lastname, p.imageUrl))))
					.then(async (res) => {
						if (!res.ok) {
							throw new Error(`Failed: ${res.status}`);
						}
						const data: ParticipantModel = await res.json();
							run({ data, error: null, status: 'success' });
					})
					.catch((err: Error) => {
						run({ data: null, error: err, status: 'error' });
					});

				return () => {};
			}
		};
	}

	getParticipants(): Subscription<DataStatus<ParticipantModel[]>> {
		const mockDataProvider = new MockParticipantDataProvider();
		return {
			subscribe(run, invalidate) {
				invalidate?.();
				const res = new Response(JSON.stringify(mockDataProvider.getParticipants()));
				Promise.resolve(res)
					.then(async (res: Response) => {
						if (!res.ok) {
							throw new Error(`Failed: ${res.status}`);
						}
						const data: ParticipantModel[] = await res.json();
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

	deleteParticipant(participant: ParticipantModel): Subscription<Error | null> {
		const mockDataProvider = new MockParticipantDataProvider();
		return {
			subscribe(run, invalidate) {
				invalidate?.();
				const res = new Response(JSON.stringify(mockDataProvider.deleteParticipant(participant)));
				Promise.resolve(res)
					.then(async (res: Response) => {
						if (!res.ok) {
							throw new Error(`Failed: ${res.status}`);
						}
						run(null);
					})
					.catch((err: Error) => {
						run(err);
					});

				// Unsubscriber (cleanup)
				return () => {};
			}
		};
	}

	editParticipant(participant: ParticipantModel): Subscription<Error | null> {
		const mockDataProvider = new MockParticipantDataProvider();
		return {
			subscribe(run: Subscriber<Error | null>, invalidate?: () => void): Unsubscriber {
				invalidate?.();
				const res = new Response(JSON.stringify(mockDataProvider.editParticipant(participant)));
				Promise.resolve(res)
					.then(async (res: Response) => {
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
}

class MockParticipantDataProvider {
	static participants: ParticipantModel[] = [
		{
			firstname: 'Hesam',
			lastname: 'Eskandari',
			imageUrl: 'https://media.licdn.com/dms/image/v2/D5603AQEPI9bIXOcaYA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1726718100271?e=1762387200&v=beta&t=mE9DRFq7sR0dB_b49vvCuISueR6wL4ttV99a29eqZA8',
			id: '1'
		},
		{
			firstname: 'Mahsa',
			lastname: 'Aghajani',
			imageUrl: 'https://media.licdn.com/dms/image/v2/C4D03AQGurYN5tfBfig/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1543775824818?e=1762387200&v=beta&t=sYm8CgzBhOvdYcvSwIE2OG5m_wo35J6cgRixxT2dkuk',
			id: '2'
		}
	];
	
	getParticipants(): ParticipantModel[] {
		return [...MockParticipantDataProvider.participants];
	}
	
	deleteParticipant(participant: ParticipantModel): Error | null {
		const index = MockParticipantDataProvider.participants.findIndex((p) => p.id === participant.id);
		if (index === -1) {
			return new Error(`failed deleting participant, id ${participant.id} not found`)
		}
		MockParticipantDataProvider.participants = MockParticipantDataProvider.participants.filter((p) => p.id !== participant.id);
		return null;
	}
	
	addParticipant(firstname: string, lastname: string, imageUrl: string): ParticipantModel {
		const participant = {firstname, lastname, imageUrl, id: (Math.random() * 1000).toString(36)} as ParticipantModel;
		MockParticipantDataProvider.participants.push(participant);
		return participant;
	}

	editParticipant(participant: ParticipantModel): Error | null {
		const index = MockParticipantDataProvider.participants.findIndex((p) => p.id === participant.id);
		if (index === -1) {
			return new Error(`failed updating participant, id ${participant.id} not found`)
		}
		MockParticipantDataProvider.participants[index] = participant;
		return null;
	}
}