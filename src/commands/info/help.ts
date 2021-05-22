import { Command, CommandHandler, getThing, BetterEmbed, Tag } from 'advanced-command-handler'
import { Context } from '../../class/Context'
import { help } from "../../config.json"


export default new Command(
	{
		name: 'help',
		description: 'Get the help of the bot',
		aliases: ['h'],
		tags: [Tag.guildOnly],
		cooldown: 5,
        usage: 'help [command]'
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
		const embed = new BetterEmbed()
		const categories = help.category

        if (ctx.args[0]) {
            const command = await getThing('command', ctx.args[0].toLowerCase().normalize())
			if (command) {
				const text = `${command.tags.includes(Tag.ownerOnly) ? "**Only available to the owner(s).**\n" : ""}${command.tags.includes(Tag.guildOwnerOnly) ? "**Only available to the guild owner.**\n" : ""}${command.tags.includes(Tag.nsfw) ? "**Only available in a nsfw channel." : ""}`

				embed.title = `Help on command : ${command.name}`
				embed.description = `<> = Require, [] = Optional
				Category : **${categories[categories.findIndex(c => c[1] === command.category)][0] ?? `\`${command.category}\``}**
				Available in private messages : **${command.tags.includes(Tag.guildOnly) ? "no" : "yes"}**
				${text}`
				if (command.description) {
					embed.fields.push({
						name: "Description :",
						value: command.description,
						inline: false
					})
				}

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
			} else {
				embed.title = 'Here is the list of commands:'
				embed.description = `Type ${handler.prefixes[0]}help <command> to get information on a command`
				let commands: Command[] = []
				handler.commands.map(command => {
					const missingPermissions = command.getMissingPermissions(ctx.message)
					const missingTags = command.getMissingTags(ctx.message)
					if (missingPermissions.client.length === 0 && missingPermissions.user.length === 0 && missingTags.length === 0) commands.push(command)
				})
				for (const category of categories) {
					embed.fields.push({
						name: category[0],
						value: `\`${commands.filter(c => c.category === category[1]).map(c => c.name).sort().join('`, `')}\``,
						inline: false
					})
				}
			}
        } else {
			embed.title = 'Here is the list of commands:'
			embed.description = `Type ${handler.prefixes[0]}help <command> to get information on a command`
			let commands: Command[] = []
			handler.commands.map(command => {
				const missingPermissions = command.getMissingPermissions(ctx.message)
				const missingTags = command.getMissingTags(ctx.message)
				if (missingPermissions.client.length === 0 && missingPermissions.user.length === 0 && missingTags.length === 0) commands.push(command)
			})
			for (const category of categories) {
				embed.fields.push({
					name: category[0],
					value: `\`${commands.filter(c => c.category === category[1]).map(c => c.name).sort().join('`, `')}\``,
					inline: false
				})
			}
		}
		return ctx.send({embed: embed})
	}
)