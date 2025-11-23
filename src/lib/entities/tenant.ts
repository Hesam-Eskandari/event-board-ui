interface TenantModel {
	role: string;
	tag: string;
	adminToken: string | null;
	editorToken: string | null;
	visitorToken: string | null;
}
