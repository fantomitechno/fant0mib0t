import { Command, CommandHandler, BetterEmbed, Tag } from 'advanced-command-handler'
import { MysqlError } from 'mysql'
import { Context } from '../../class/Context'
import { create, query } from '../../functions/db'
import { getUserFromMention } from '../../functions/get'
import { sendToModLogs } from '../../functions/logging'


export default new Command(
	{
		name: 'warn',
		description: 'Let speak with the very soft banhammer',
		aliases: ['w'],
		tags: [Tag.guildOnly],
        usage: 'warn [member] <reason>',
        userPermissions: ["MANAGE_MESSAGES"]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        const member = getUserFromMention(ctx.message, ctx.args[0])
        if (!member) return ctx.send('The member you provided is not available. Have you gived a valide member ?')
		let reason = ctx.args.slice(1).join(' ')
		if (!reason.length) reason = "Non specified"
		if (reason.includes('/')) return ctx.send('Sorry but your reason contain an unautorised caracter : `/`')
		const embedBanned = new BetterEmbed({
			title: "You were warned on "+ ctx.guild?.name ?? "None, wait what ?",
			description: "<a:banhammer:844881353841442826> Reason : `" + reason +"`",
			color: "RED"
		})
		const embedBanner = new BetterEmbed({
			title: "Case update",
			description: `${member} have been succefuly warned on ${ctx.guild?.name}`,
			color: "GREEN"
		})
		member?.send(embedBanned).catch(() => {
			embedBanner.footer = {
				text: `An error aucured when I tried to dm this user`
			}
		})
		let created = await create("casier", ["id", member.id], ["guilds, reasons, mods, type", `"${ctx.guild?.id}", "${reason}", "${ctx.author.id}, "warn"`])
		if (!created) {
			query(`SELECT * FROM casier WHERE id = "${member.id}"`, (err: MysqlError|null, res: any) => {
				if (err) return console.log(err)
				res = res[0]
				query(`UPDATE casier SET guilds = "${res.guilds + "/" + ctx.guild?.id}", reasons = "${(res.reasons).toString() + "/" + reason}",  mods = "${res.mods + "/" + ctx.author.id}", type = "${res.type + "/warn"}" WHERE id = "${member.id}"`, (err: MysqlError|null, _: any) => {
					if (err) return console.log(err)
				})
			})
		}
		ctx.delete()
		ctx.send(embedBanner)
		sendToModLogs(ctx.guild, `<a:banhammer:844881353841442826> ${member} by ${ctx.member} | reason : ${reason}`, "warn")
    }
)
