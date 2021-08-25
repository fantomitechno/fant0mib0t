import {Message} from 'discord.js';
import {Event, CommandHandler, getThing, permissionsError, Tag, Logger, argError, codeError} from 'advanced-command-handler'
import {Context} from "../utils/class/Context"
import {query} from "../utils/functions/db"
import { MysqlError } from 'mysql';
import { Config } from '../utils/type/Config';
import { SConfig } from '../utils/type/Database';

export default new Event(
	{
		name: 'message',
	},
	async (handler: typeof CommandHandler, message: Message): Promise<any> => {
		if (message.author.bot || message.system) return;

		const prefix = CommandHandler.getPrefixFromMessage(message);

		if (message.guild) {
			query(`SELECT * FROM config WHERE guild = "${message.guild.id}"`, (err: MysqlError, res: SConfig[]) => {
				if (!res.length) {
					query(`INSERT INTO config (guild, config) VALUES ("${message.guild?.id}", '{"automod":{"antilink": true, "uppercase":true, "spam":true, "dupplicated":true}, "antilinkBypass": null, "linkPreview":true, "dynamicVoiceBase": null}')`)
					return
				}
				const resEdit = res[0]
				let config: Config = JSON.parse(resEdit.config)
				if (config.linkPreview && !prefix) handler.client?.emit("linkPreview", (message))
				handler.client?.emit("automod", message, config)
			})
		}

		if (message.content.replace('!',"") === "<@" + handler.client?.user?.id + ">") message.channel.send("My prefix is `" + handler.prefixes[0] +"`")

		
		if (!prefix) return;

		const [commandArg, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = await getThing('command', commandArg.toLowerCase().normalize());

		if (command) {
			if (command.isInCooldown(message)) return message.channel.send(`You are on a cooldown! Please wait **${command.getCooldown(message).waitMore / 1000}**s.`);

			if (!command.isInRightChannel(message)) return message.channel.send(`This command is not in the correct channel.`);

			const missingPermissions = command.getMissingPermissions(message);
			const missingTags = command.getMissingTags(message);

			if (missingPermissions.client.length) return permissionsError(message, missingPermissions.client, command, true);
			if (missingPermissions.user.length) return permissionsError(message, missingPermissions.user, command);

			if (missingTags.length)
				return argError(
					message,
					`There are missing tags for the message: \n\`${missingTags
						.map(tag => Tag[tag])
						.sort()
						.join('\n')
						.toUpperCase()}\``,
					command
				);
			if (!message.guild?.me?.hasPermission('EMBED_LINKS')) return message.channel.send(`I need the EMBED LINK permission for a lot of commands`).then((m: Message) => {
				setTimeout(() => m.delete(), 5000)
			})
			try {
                let ctx = new Context(handler, message, prefix, args, command)
				await command.run(handler, ctx);
				command.setCooldown(message);
				Logger.log(`${message.author.tag} has executed the command ${Logger.setColor('red', command.name)}.`);
			} catch (error) {
				await codeError(message, error, command);
			}
		}
	}
);