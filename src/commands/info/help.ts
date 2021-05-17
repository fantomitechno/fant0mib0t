import { Command, CommandHandler, getThing, BetterEmbed, Tag } from 'advanced-command-handler'
import { Message } from 'discord.js'


export default new Command(
	{
		name: 'help',
		description: 'Get the help of the bot',
		aliases: ['h'],
		tags: [Tag.guildOnly],
		cooldown: 5,
        usage: 'help [command]'
	},
	async (handler: typeof CommandHandler, message: Message, args: string[]) => {
		const embed = new BetterEmbed()

        if (args[0]) {
            const command = await getThing('command', args[0].toLowerCase().normalize())
			if (command) {
				const text = `${command.tags.includes(Tag.ownerOnly) ? "**Only available to the owner(s).**\n" : ""}${command.tags.includes(Tag.guildOwnerOnly) ? "**Only available to the guild owner.**\n" : ""}${command.tags.includes(Tag.nsfw) ? "**Only available in a nsfw channel." : ""}`

				embed.title = `Help on command : ${command.name}`
				embed.description = `<> = Require, [] = Optional
				Category : **${command.category}**
				Available in private messages : **${command.tags.includes(Tag.guildOnly) ? "no" : "yes"}**
				${text}`

				embed.fields.push({
					name: "Description :",
					value: command.description,
					inline: false
				})

				if (command.usage) {
					embed.fields.push({
						name: 'Syntax :',
						value: command.usage,
						inline: false
					})
				}
				if (command.userPermissions) {
					embed.fields.push({
						name: 'User permissions required :',
						value: command.userPermissions.join(' '),
						inline: false
					})
				}

				if (command.clientPermissions) {
					embed.fields.push({
						name: 'Bot permissions required :',
						value: command.clientPermissions.join(' '),
						inline: false
					})
				}

				if (command.aliases) {
					embed.fields.push({
						name: 'Aliases :',
						value: command.aliases.join(' '),
						inline: false
					})
				}
			}
        } else {
			embed.title = 'Here is the list of commands:'
			embed.description = `Type ${handler.prefixes[0]}help <command> to get information on a command\n\n${handler.commands
				.map(c => `**${c.name}** : ${c.description}`)
				.sort()
				.join('\n\n')
			}`
		}
		return message.channel.send({embed: embed})
	}
)