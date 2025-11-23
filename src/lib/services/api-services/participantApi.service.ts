import type { Subscriber, Unsubscriber } from 'svelte/store';
import type { ParticipantService } from '$lib/services/participant.service';
import type { ParticipantModel } from '$lib/entities/participant';
import type { Subscription } from '$lib/entities/subscription';
import type { DataStatus } from '$lib/entities/data-status';
import { PUBLIC_BASE_API_URL } from '$env/static/public';
import type { ParticipantCreateDTO, ParticipantReadDTO, ParticipantUpdateDTO } from '$lib/services/api-services/dtos/participant';
import { TokenSnapshotStore } from '$lib/store/token.snapshot.store';

export class ParticipantApiService implements ParticipantService {

	private static addQParams(url: URL,  params: URLSearchParams): URL {
		params.entries().forEach(([key, value]) => {
			if (value != null) {
				url.searchParams.set(key, String(value));
			}
		});
		return url;
	}

	addParticipant(p:ParticipantModel): Subscription<DataStatus<ParticipantModel | null>> {
		return {
			subscribe: (run, invalidate) => {
				invalidate?.();
				const params = new URLSearchParams({
					...TokenSnapshotStore.getTokenQParam()
				});
				if (!TokenSnapshotStore.hasToken(params)) {
					run({ data: null, error: new Error('token not found: cannot add participant without a tenant token'), status: 'error' });
					return () => {};
				}
				const url: URL = ParticipantApiService.addQParams(new URL(`${PUBLIC_BASE_API_URL}/participants/`), params);
				const dto = {
					firstname: p.firstname,
					lastname: p.lastname,
					imageUrl: p.imageUrl
				} as ParticipantCreateDTO;
				fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dto)
				}).then(async (res) => {
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
		return {
			subscribe(run, invalidate) {
				invalidate?.();
				const params = new URLSearchParams({
					...TokenSnapshotStore.getTokenQParam()
				});
				const url: URL = ParticipantApiService.addQParams(new URL(`${PUBLIC_BASE_API_URL}/participants/`), params);
				if (!TokenSnapshotStore.hasToken(params)) {
					run({ data: [], error: new Error('token not found: cannot get participants without a tenant token'), status: 'error' });
					return () => {};
				}
				fetch(url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(async (res: Response) => {
						if (!res.ok) {
							throw new Error(`Failed: ${res.status}`);
						}
						const raw: ParticipantReadDTO[] = await res.json();
						const data = raw.map((dto: ParticipantReadDTO) => ({
							firstname: dto.firstname,
							lastname: dto.lastname,
							imageUrl: dto.imageUrl,
							id: dto.id
						} as ParticipantModel));
						console.log(data)
						run({ data, error: null, status: 'success' });
					})
					.catch((err) => {
						console.log(err);
						run({ data: [], error: err, status: 'error' });
					});

				return () => {};
			}
		};
	}

	deleteParticipant(participant: ParticipantModel): Subscription<Error | null> {
		return {
			subscribe(run, invalidate) {
				invalidate?.();
				const params = new URLSearchParams({
					...TokenSnapshotStore.getTokenQParam()
				});
				if (!TokenSnapshotStore.hasToken(params)) {
					run(new Error('token not found: cannot delete participant without a tenant token'));
					return () => {};
				}
				const url: URL = ParticipantApiService.addQParams(new URL(`${PUBLIC_BASE_API_URL}/participants/${participant.id}`), params);
				fetch(url, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					}
				}).then(async (res: Response) => {
						if (!res.ok) {
							throw new Error(`Failed: ${res.status}`);
						}
						run(null);
					})
					.catch((err: Error) => {
						run(err);
					});

				return () => {};
			}
		};
	}

	editParticipant(participant: ParticipantModel): Subscription<Error | null> {
		return {
			subscribe(run: Subscriber<Error | null>, invalidate?: () => void): Unsubscriber {
				invalidate?.();
				const params = new URLSearchParams({
					...TokenSnapshotStore.getTokenQParam()
				});
				if (!TokenSnapshotStore.hasToken(params)) {
					run(new Error('token not found: cannot edit participant without a tenant token'));
					return () => {};
				}
				const url: URL = ParticipantApiService.addQParams(new URL(`${PUBLIC_BASE_API_URL}/participants/${participant.id}`), params);
				const dto: ParticipantUpdateDTO = {
					firstname: participant.firstname,
					lastname: participant.lastname,
					imageUrl: participant.imageUrl
				};

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
