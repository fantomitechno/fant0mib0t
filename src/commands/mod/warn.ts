import { Command, CommandHandler, BetterEmbed, Tag } from 'advanced-command-handler'
import { MysqlError } from 'mysql'
import { Context } from '../../class/Context'
import { query } from '../../functions/db'
import { getUserFromMention } from '../../functions/get'
import { sendToModLogs } from '../../functions/logging'
import { casier } from '../../type/Database'


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
		if (reason.includes('▪')) return ctx.send('Sorry but your reason contain an unautorised caracter : `▪`')
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
		query(`SELECT * FROM casier WHERE id = "${member.id}"`, (err: MysqlError|null, res: casier[]) => {
			if (err) return console.log(err)
			if (!res.length) {
				query(`INSERT INTO casier (id, guilds, type, reasons, mods) VALUES ("${member.id}", "${ctx.guild?.id}", "warn", "${reason}", "${ctx.author.id}")`)
			} else {
				const resEdit = res[0]
				query(`UPDATE casier SET guilds = "${resEdit.guilds + '▪' + ctx.guild?.id}", reasons = "${(resEdit.reasons).toString() + '▪' + reason}",  mods = "${resEdit.mods + '▪' + ctx.author.id}", type = "${resEdit.type + "▪warn"}" WHERE id = "${member.id}"`)
			}
		})
		ctx.delete()
		ctx.send(embedBanner)
		sendToModLogs(ctx.guild, `<a:banhammer:844881353841442826> ${member} by ${ctx.member} | reason : ${reason}`, "warn")
    }
)
