export interface TenantReadDTO {
	role: string;
	adminToken: string | null;
	editorToken: string | null;
	visitorToken: string | null;
}
