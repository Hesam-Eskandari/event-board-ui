export type Status = 'success' | 'error' | 'loading' | 'never';

export interface DataStatus<t> {
	error: Error | null;
	status: Status;
	data: t;
}
