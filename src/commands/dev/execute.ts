import { Command, CommandHandler, BetterEmbed, Tag, getThing } from 'advanced-command-handler'
import { Message } from 'discord.js'
import { MysqlError } from 'mysql'
import { Context } from '../../class/Context'
import { create, query } from '../../functions/db'
import { getUser, getUserFromMention } from '../../functions/get'
import { sendToModLogs } from '../../functions/logging'


export default new Command(
	{
		name: 'ban',
		description: 'Let speak with the banhammer',
		aliases: ['b'],
		tags: [Tag.guildOnly, Tag.ownerOnly],
		cooldown: 5,
        usage: 'ban [member]',
        clientPermissions: ['BAN_MEMBERS'],
        userPermissions: ['BAN_MEMBERS', 'KICK_MEMBERS']
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
		if (!ctx.args[0]) return ctx.send("You have to enter an user")
		const member = getUser(ctx.message, ctx.args[0])
		if (!member) return ctx.send('Invalid user')
        if (!ctx.args[1]) return ctx.send("You have to enter a message")
		const message = new Message(ctx.message.client, {
			content: ctx.args.slice(1).join(' '),
			author: member.user,
			member: member,
			nonce: '844940651798724608',
			createdTimestamp: ctx.message.createdTimestamp,
			mentions: ctx.message.mentions
		}, ctx.channel)
		handler.client?.emit("message", (message))
    }
)