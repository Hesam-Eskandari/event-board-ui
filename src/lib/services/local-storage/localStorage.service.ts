export class LocalStorageService {
	private static app_prefix = 'event-board_';
	private static workspace_prefix = `${LocalStorageService.app_prefix}_workspace_`;

	static saveWorkspace(tenant: TenantModel): Error | null {
		try {
			localStorage.setItem(`${LocalStorageService.workspace_prefix}_${tenant.tag}`, JSON.stringify({tag: tenant.tag, token: tenant.adminToken ?? tenant.editorToken ?? tenant.visitorToken}));
		}	catch (error) {
			return new Error(`${error}`);
		}
		return null;
	}

	static getWorkspace(tag: string): [{tag: string; token: string} | null, Error | null]  {
		const workspace = localStorage.getItem(`${LocalStorageService.workspace_prefix}_${tag}`);
		if (workspace == null) {
			return [null, new Error(`Workspace "${tag}" not found`)];
		}
		let parsedWorkspace: {tag: string; token: string} | null = null;
		try {
			parsedWorkspace = JSON.parse(workspace);
		} catch (error) {
			return [null, new Error(`${error}`)];
		}
		return [parsedWorkspace, null];
	}
}
