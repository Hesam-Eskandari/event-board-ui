interface TenantModel {
	role: string;
	adminToken: string | null;
	editorToken: string | null;
	visitorToken: string | null;
}
