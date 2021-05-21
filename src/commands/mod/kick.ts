import { Command, CommandHandler, BetterEmbed, Tag } from 'advanced-command-handler'
import { MysqlError } from 'mysql'
import { Context } from '../../class/Context'
import { create, query } from '../../functions/db'
import { getUserFromMention } from '../../functions/get'
import { sendToModLogs } from '../../functions/logging'


export default new Command(
	{
		name: 'kick',
		description: 'Let speak with the soft banhammer',
		aliases: ['k'],
		tags: [Tag.guildOnly],
		cooldown: 5,
        usage: 'kick [member] <reason>',
        clientPermissions: ['KICK_MEMBERS'],
        userPermissions: [ 'KICK_MEMBERS']
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        const member = getUserFromMention(ctx.message, ctx.args[0])
        if (!member) return ctx.send('The member you provided is not available. Have you gived a valide member ?')
        if (!member.kickable) return ctx.send('I can\'t kick this member')
		let reason = ctx.args.slice(1).join(' ')
		if (!reason.length) reason = "Non specified"
		if (reason.includes('/')) return ctx.send('Sorry but your reason contain an unautorised caracter : `/`')
		const embedBanned = new BetterEmbed({
			title: "You were kicked from "+ ctx.guild?.name ?? "None, wait what ?",
			description: "<a:banhammer:844881353841442826> Reason : `" + reason +"`"
		})
		const embedBanner = new BetterEmbed({
			title: "Case update",
			description: `${member} have been succefuly banned from ${ctx.guild?.name}`
		})
		member?.send(embedBanned).catch(() => {
			embedBanner.footer = {
				text: `An error aucured when I tried to dm this user`
			}
		})
		member.kick(ctx.args.slice(1).join(' ') + " | Opered by " + ctx.member?.displayName).then(async m => {
			let created = await create("casier", ["id", m.id], ["guilds, reasons, mods, type", `"${ctx.guild?.id}", "${reason}", "${ctx.author.id}, "kick"`])
			if (!created) {
				query(`SELECT * FROM casier WHERE id = ${m.id}`, (err: MysqlError|null, res: any) => {
					if (err) throw err
					res = res[0]
					query(`UPDATE casier SET guilds = "${res.guilds + "/" + ctx.guild?.id}", reasons = "${(res.reasons).toString() + "/" + reason}",  mods = "${res.mods + "/" + ctx.author.id}", type = "${res.type + "/kick"}" WHERE id = "${m.id}"`, (err: MysqlError|null, _: any) => {
						if (err) throw err
					})
				})
			}
			ctx.delete()
			ctx.send(embedBanner)
			sendToModLogs(ctx.message, `<a:banhammer:844881353841442826> ${member} by ${ctx.member} | reason : ${reason}`, "kick")
		})
    }
)
