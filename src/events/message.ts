import {Message} from 'discord.js';
import { Event, CommandHandler, getThing, permissionsError, Tag, Logger, argError, codeError} from 'advanced-command-handler'
import {Context} from "../class/Context"

export default new Event(
	{
		name: 'message',
	},
	async (handler: typeof CommandHandler, message: Message): Promise<any> => {
		if (message.author.bot || message.system) return;

		const prefix = CommandHandler.getPrefixFromMessage(message);
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