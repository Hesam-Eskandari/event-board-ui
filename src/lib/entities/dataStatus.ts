export type Status = 'success' | 'error' | 'loading';

export interface DataStatus<t> {
	error: Error | null;
	status: Status;
	data: t;
}
