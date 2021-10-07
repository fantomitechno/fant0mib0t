import {ApplicationCommandOptionData, Client, ClientOptions, Collection} from 'discord.js';
import {readdirSync} from 'fs';
import {Command, Event} from './index';
import {SubCommand} from './Command';
import {BotOptions} from '../types/Bot';
import {createConnection} from 'mysql';
import {Logger} from './Logger';
import { ContextMenu } from './ContextMenu';

export function propertyInEnum<V extends {[k: string]: any}>(enumObject: V, property: string): keyof V | undefined {
	return enumObject[property] ?? undefined;
}

const Categories = {
	config: '⚙️ Configuration',
	dev: '💻 Developpers',
	info: '🌐 Informations',
	potato: '🥔 Potatoes',
};

export class Bot extends Client {
	inDev: boolean;

	developpers: string[];

	launchedAt: number;

	constructor(options: BotOptions, clientOptions: ClientOptions) {
		super(clientOptions);
		this.inDev = options.inDev;
		this.developpers = options.devs;
		this.launchedAt = Date.now();

		this.launch();
	}

	private database = createConnection({
		database: process.env.DB_DB,
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
	});

	dbOnline = true;

	private async launchDB() {
		try {
			Logger.info('DB CONNECTION');
			this.database.connect((err) => {
				this.dbOnline = false
				Logger.error(err, 'DB CONNECTION');
			});
		} catch (error) {
			this.dbOnline = false
			Logger.error(error, 'DB CONNECTION');
		}
	}

	query = (query: string, fonction?: Function) => {
		return this.database.query(query, fonction);
	};

	commands = new Collection<string, Command | SubCommand>();

	contextMenu = new Collection<string, ContextMenu>();

	private async launchHandler() {
		const pathEvent: string = 'events/';
		readdirSync(`./out/${pathEvent}`).forEach(event => {
			if (!event.endsWith('.js') || event.startsWith('_')) return;
			delete require.cache[require.resolve('../../' + pathEvent + event)];

			const eventClass: Event = require('../../' + pathEvent + event).default;
			this.on(eventClass.name, eventClass.run.bind(null, this));
		});

		const pathCommands: string = 'commands';
		readdirSync(`./out/${pathCommands}/`).forEach(dirs => {
			const commands = readdirSync(`./out/${pathCommands}/${dirs}/`).filter(files => files.endsWith('.js') && !files.startsWith("_"));

			for (const file of commands) {
				const props: any = require(`../../${pathCommands}/${dirs}/${file}`).default;
				props.data.description = propertyInEnum(Categories, dirs) + '・' + props.data.description;

				for (const c of props.data.options?.filter((d: any) => d.type === 'SUB_COMMAND' || d.type === 'SUB_COMMAND_GROUP') ?? []) {
					c.description = propertyInEnum(Categories, dirs) + '・' + c.description;
					if (c.type === 'SUB_COMMAND_GROUP') {
						for (const cm of c.options?.filter((d: any) => d.type === 'SUB_COMMAND' || d.type === 'SUB_COMMAND_GROUP') ?? []) {
							cm.description = propertyInEnum(Categories, dirs) + '・' + cm.description;
						}
					}
				}
				this.commands.set(props.data.name, props);

				const manageSubCommand = (path: string, o: any) => {
					if (o.type == 'SUB_COMMAND_GROUP') {
						for (const option of o.options ?? []) manageSubCommand(`${path}/${o.name}`, option ?? {});
					} else if (o.type == 'SUB_COMMAND') {
						const propsSC: SubCommand = require(`../../${pathCommands}/${dirs}/${path}/${o.name}`).default;
						this.commands.set(`${path}/${o.name}`, propsSC);
					}
				};
				const options: ApplicationCommandOptionData[] = props.data.options ?? [];
				for (const o of options) manageSubCommand(props.data.name, o);
			}
		});

		const pathContext: string = 'context';
		readdirSync(`./out/${pathContext}/`).filter(files => files.endsWith('.js') && !files.startsWith("_")).forEach(file => {
			
			const props: any = require(`../../${pathContext}/${file}`).default;
			this.contextMenu.set(props.data.name, props);
		});
	}

	async launch() {
		await this.launchHandler();

		await this.launchDB();

		if (this.inDev) {
			// Launch the Developpement bot
			this.login(process.env.TOKEN_BETA);
		} else {
			// Launch the Production bot
			this.login(process.env.TOKEN);
		}
	}
}
