export interface TenantReadDTO {
	role: string;
	tag: string;
	adminToken: string | null;
	editorToken: string | null;
	visitorToken: string | null;
}
