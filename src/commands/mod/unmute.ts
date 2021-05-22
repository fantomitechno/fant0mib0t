import { Command, CommandHandler, BetterEmbed, Tag } from 'advanced-command-handler'
import { MysqlError } from 'mysql'
import { Context } from '../../class/Context'
import { query } from '../../functions/db'
import { getUserFromMention } from '../../functions/get'
import { sendToModLogs } from '../../functions/logging'


export default new Command(
	{
		name: 'mute',
		description: 'Let speak with the sparadra',
		aliases: ['m'],
		tags: [Tag.guildOnly],
		cooldown: 5,
        usage: 'mute [member] <reason>',
        clientPermissions: ['MANAGE_ROLES'],
        userPermissions: ['MANAGE_ROLES']
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        const member = getUserFromMention(ctx.message, ctx.args[0])
        if (!member) return ctx.send('The member you provided is not available. Have you gived a valide member ?')
        if (!member.kickable) return ctx.send('I can\'t kick this member')
		let mutedRole = ctx.guild?.roles.cache.find(r => r.name.includes("mute") && !r.managed)?.id ?? "0"
		if (!member.roles.cache.has(mutedRole)) return ctx.send('This user isn\'t muted')
		let reason = ctx.args.slice(1).join(' ')
		if (!reason.length) reason = "Non specified"
		if (reason.includes('/')) return ctx.send('Sorry but your reason contain an unautorised caracter : `/`')
		const embedBanner = new BetterEmbed({
			title: "Case update",
			description: `${member} have been succefuly unmuted from ${ctx.guild?.name}`
		})
		
		query(`SELECT * FROM mute WHERE id = "${member.id}" AND guild = "${ctx.guild?.id}"`, (err: MysqlError|null, res: any) => {
			if (err) return console.log(err)
			if (res.length) {
				query(`DELETE FROM mute WHERE id = "${member.id}" AND guild = "${ctx.guild?.id}"`)
			}
		})
		member.roles.remove(mutedRole, ctx.args.slice(1).join(' ') + " | Opered by " + ctx.member?.displayName).then(async m => {
			ctx.delete()
			ctx.send(embedBanner)
			sendToModLogs(ctx.guild, `<a:banhammer:844881353841442826> ${member} by ${ctx.member} | reason : ${reason}`, "mute")
		})
    }
)
