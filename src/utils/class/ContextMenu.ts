import {ApplicationCommandData, ContextMenuInteraction, PermissionResolvable} from 'discord.js';
import {Bot} from './Bot';

type DefaultCommandRunFunction = (client: Bot, interaction: ContextMenuInteraction) => Promise<void> | void;

interface Permission {
	bot?: PermissionResolvable;
	user?: {
		perms?: PermissionResolvable;
		dev?: boolean;
	};
}

export class ContextMenu {
	data: ApplicationCommandData;

	run: DefaultCommandRunFunction;

	permission?: Permission;

	constructor(data: ApplicationCommandData, run: DefaultCommandRunFunction = () => {}, permissions?: Permission) {
		this.data = data;
		this.run = run;
		this.permission = permissions;
	}
}
