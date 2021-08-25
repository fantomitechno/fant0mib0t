import { Command, CommandHandler, BetterEmbed, Tag } from 'advanced-command-handler'
import { MysqlError } from 'mysql'
import { Context } from '../../utils/class/Context'
import { query } from '../../utils/functions/db'
import { getUserFromMention } from '../../utils/functions/get'
import { sendToModLogs } from '../../utils/functions/logging'
import { convertTime } from '../../utils/functions/string'
import { casier } from '../../utils/type/Database'


export default new Command(
	{
		name: 'tempmute',
		description: 'Let speak with the sparadra\'o clock',
		aliases: ['tm'],
		tags: [Tag.guildOnly],
        usage: 'tempmute [member] [time] <reason>',
        clientPermissions: ['MANAGE_ROLES'],
        userPermissions: ['MANAGE_MESSAGES']
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        const member = getUserFromMention(ctx.message, ctx.args[0])
        if (!member) return ctx.send('The member you provided is not available. Have you gived a valide member ?')
		if (!member.user.bot && member.hasPermission('MANAGE_ROLES') && !ctx.member?.hasPermission('ADMINISTRATOR')) return ctx.send('Sorry but you tried to tempmute a moderator not bot')
		let mutedRole = ctx.guild?.roles.cache.find(r => r.name.toLowerCase().includes("mute") && !r.managed)?.id ?? "0"
        let time: any = await convertTime(ctx.args[1])
        if (time === 'error') return ctx.reply('An error occured')
        if (time < 60000) return ctx.reply('Please enter a time more than 1m')
        if (time > convertTime("10y")) return ctx.reply('Wow keep calm, it\'s too big')
		let reason = ctx.args.slice(2).join(' ')
		if (!reason.length) reason = "Non specified"
		if (reason.includes('▪')) return ctx.send('Sorry but your reason contain an unautorised caracter : `▪`')
		const embedBanned = new BetterEmbed({
			title: "You were tempmuted on "+ ctx.guild?.name ?? "None, wait what ?",
			description: "<a:banhammer:844881353841442826> Reason : `" + reason +"`\nTime: "+ ctx.args[1],
			color: "RED"
		})
		const embedBanner = new BetterEmbed({
			title: "Case update",
			description: `${member} have been succefuly tempmuted on ${ctx.guild?.name}`,
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
					query(`INSERT INTO casier (id, guilds, type, reasons, mods) VALUES ("${m.id}", "${ctx.guild?.id}", "tempmute", "${reason}", "${ctx.author.id}")`)
				} else {
					const resEdit = res[0]
					query(`UPDATE casier SET guilds = "${resEdit.guilds + '▪' + ctx.guild?.id}", reasons = "${(resEdit.reasons).toString() + '▪' + reason}",  mods = "${resEdit.mods + '▪' + ctx.author.id}", type = "${resEdit.type + "▪tempmute"}" WHERE id = "${m.id}"`)
				}
                query(`INSERT INTO temp (id, guild, type, date, time) VALUES ("${m.id}", "${ctx.guild?.id}", "mute", "${Date.now()}", "${time}")`)
			})
			query(`SELECT * FROM mute WHERE id = "${m.id}" AND guild = "${ctx.guild?.id}"`, (err: MysqlError|null, res: any) => {
                if (err) return console.log(err)
                if (!res.length) {
                    query(`INSERT INTO mute (id, guild) VALUES (${m.id}, ${ctx.guild?.id})`)
                }
            })
			ctx.delete()
			ctx.send(embedBanner)
			sendToModLogs(ctx.guild, `<a:banhammer:844881353841442826> ${member} by ${ctx.member} | reason : ${reason} | time : ${ctx.args[1]}`, "tempmute")
		}).catch(_ => {
            ctx.send("An error occured when I tried to mute this user (maybe the muted role is too high)")
        })
    }
)
