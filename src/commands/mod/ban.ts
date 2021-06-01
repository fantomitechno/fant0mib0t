import { Command, CommandHandler, BetterEmbed, Tag } from 'advanced-command-handler'
import { MysqlError } from 'mysql'
import { Context } from '../../class/Context'
import { query } from '../../functions/db'
import { getUserFromMention } from '../../functions/get'
import { sendToModLogs } from '../../functions/logging'


export default new Command(
	{
		name: 'ban',
		description: 'Let speak with the banhammer',
		aliases: ['b'],
		tags: [Tag.guildOnly],
        usage: 'ban [member] <reason>',
        clientPermissions: ["BAN_MEMBERS"],
        userPermissions: ['BAN_MEMBERS', "KICK_MEMBERS"]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        const member = getUserFromMention(ctx.message, ctx.args[0])
        if (!member) return ctx.send('The member you provided is not available. Have you gived a valide member ?')
        if (!member.bannable) return ctx.send('I can\'t ban this member')
		if (!member.user.bot && member.hasPermission('BAN_MEMBERS') && !ctx.member?.hasPermission('ADMINISTRATOR')) return ctx.send('Sorry but you tried to ban a moderator not bot')
		let reason = ctx.args.slice(1).join(' ')
		if (!reason.length) reason = "Non specified"
		if (reason.includes('/')) return ctx.send('Sorry but your reason contain an unautorised caracter : `/`')
		const embedBanned = new BetterEmbed({
			title: "You were banned from "+ ctx.guild?.name ?? "None, wait what ?",
			description: "<a:banhammer:844881353841442826> Reason : `" + reason +"`",
			color: "RED"
		})
		const embedBanner = new BetterEmbed({
			title: "Case update",
			description: `${member} have been succefuly banned from ${ctx.guild?.name}`,
			color: "GREEN"
		})
		member?.send(embedBanned).catch(() => {
			embedBanner.footer = {
				text: `An error aucured when I tried to dm this user`
			}
		})
		member.ban({reason: ctx.args.slice(1).join(' ') + " | Opered by " + ctx.member?.displayName}).then(async m => {
			query(`SELECT * FROM casier WHERE id = "${member.id}"`, (err: MysqlError|null, res: any) => {
				if (err) return console.log(err)
				if (!res.length) {
					query(`INSERT INTO casier (id, guilds, type, reasons, mods) VALUES ("${member.id}", "${ctx.guild?.id}", "ban", "${reason}", "${ctx.author.id}")`)
				} else {
					res = res[0]
					query(`UPDATE casier SET guilds = "${res.guilds + "/" + ctx.guild?.id}", reasons = "${(res.reasons).toString() + "/" + reason}",  mods = "${res.mods + "/" + ctx.author.id}", type = "${res.type + "/ban"}" WHERE id = "${member.id}"`)
				}
			})
			ctx.delete()
			ctx.send(embedBanner)
			sendToModLogs(ctx.guild, `<a:banhammer:844881353841442826> ${member} by ${ctx.member} | reason : ${reason}`, "ban")
		})
    }
)