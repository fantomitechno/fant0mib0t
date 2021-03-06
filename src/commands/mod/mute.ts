import { Command, CommandHandler, BetterEmbed, Tag } from 'advanced-command-handler'
import { MysqlError } from 'mysql'
import { Context } from '../../class/Context'
import { query } from '../../functions/db'
import { getUserFromMention } from '../../functions/get'
import { sendToModLogs } from '../../functions/logging'
import { casier, mute } from '../../type/Database'


export default new Command(
	{
		name: 'mute',
		description: 'Let speak with the sparadra',
		aliases: ['m'],
		tags: [Tag.guildOnly],
        usage: 'mute [member] <reason>',
        clientPermissions: ['MANAGE_ROLES'],
        userPermissions: ['MANAGE_MESSAGES']
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        const member = getUserFromMention(ctx.message, ctx.args[0])
        if (!member) return ctx.send('The member you provided is not available. Have you gived a valide member ?')
		if (!member.user.bot && member.hasPermission('MANAGE_ROLES') && !ctx.member?.hasPermission('ADMINISTRATOR')) return ctx.send('Sorry but you tried to mute a moderator not bot')
        let mutedRole = ctx.guild?.roles.cache.find(r => r.name.toLowerCase().includes("mute") && !r.managed)?.id ?? "0"
		let reason = ctx.args.slice(1).join(' ')
		if (!reason.length) reason = "Non specified"
		if (reason.includes('▪')) return ctx.send('Sorry but your reason contain an unautorised caracter : `▪`')
		const embedBanned = new BetterEmbed({
			title: "You were muted on "+ ctx.guild?.name ?? "None, wait what ?",
			description: "<a:banhammer:844881353841442826> Reason : `" + reason +"`",
			color: "RED"
		})
		const embedBanner = new BetterEmbed({
			title: "Case update",
			description: `${member} have been succefuly muted from ${ctx.guild?.name}`,
			color: "GREEN"
		})
		member?.send(embedBanned).catch(() => {
			embedBanner.footer = {
				text: `An error aucured when I tried to dm this user`
			}
		})
		member.roles.add(mutedRole, ctx.args.slice(1).join(' ') + " | Opered by " + ctx.member?.displayName).then(async m => {
			query(`SELECT * FROM casier WHERE id = "${m.id}"`, (err: MysqlError|null, res: casier[]) => {
				if (err) return console.log(err)
				if (!res.length) {
					query(`INSERT INTO casier (id, guilds, type, reasons, mods) VALUES ("${m.id}", "${ctx.guild?.id}", "mute", "${reason}", "${ctx.author.id}")`)
				} else {
					const resEdit = res[0]
					query(`UPDATE casier SET guilds = "${resEdit.guilds + '▪' + ctx.guild?.id}", reasons = "${(resEdit.reasons).toString() + '▪' + reason}",  mods = "${resEdit.mods + '▪' + ctx.author.id}", type = "${resEdit.type + "▪mute"}" WHERE id = "${m.id}"`)
				}
			})
			query(`SELECT * FROM mute WHERE id = "${m.id}" AND guild = "${ctx.guild?.id}"`, (err: MysqlError|null, res: mute[]) => {
                if (err) return console.log(err)
                if (!res.length) {
                    query(`INSERT INTO mute (id, guild) VALUES (${m.id}, ${ctx.guild?.id})`)
                }
            })
			ctx.delete()
			ctx.send(embedBanner)
			sendToModLogs(ctx.guild, `<a:banhammer:844881353841442826> ${member} by ${ctx.member} | reason : ${reason}`, "mute")
		}).catch(_ => {
            ctx.send("An error occured when I tried to mute this user (maybe the muted role is too high)")
        })
    }
)
