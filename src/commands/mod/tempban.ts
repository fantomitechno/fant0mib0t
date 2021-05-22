import { Command, CommandHandler, BetterEmbed, Tag } from 'advanced-command-handler'
import { MysqlError } from 'mysql'
import { Context } from '../../class/Context'
import { create, query } from '../../functions/db'
import { getUserFromMention } from '../../functions/get'
import { sendToModLogs } from '../../functions/logging'
import { convertTime } from '../../functions/string'


export default new Command(
	{
		name: 'tempban',
		description: 'Let speak with the banhammer\'o clock',
		aliases: ['tb'],
		tags: [Tag.guildOnly],
		cooldown: 5,
        usage: 'ban [member] [time] <reason>',
        clientPermissions: ['BAN_MEMBERS'],
        userPermissions: ['BAN_MEMBERS', 'KICK_MEMBERS']
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        const member = getUserFromMention(ctx.message, ctx.args[0])
        if (!member) return ctx.send('The member you provided is not available. Have you gived a valide member ?')
        if (!member.bannable) return ctx.send('I can\'t ban this member')
		if (!member.user.bot && member.hasPermission('BAN_MEMBERS') && !ctx.member?.hasPermission('ADMINISTRATOR')) return ctx.send('Sorry but you tried to tempban a moderator not bot')
        let time: any = await convertTime(ctx.args[1])
        if (time === 'error') return ctx.reply('An error occured')
        if (time < 60000) return ctx.reply('Please enter a time more than 1m')
        if (time > convertTime("10y")) return ctx.reply('Wow keep calm, it\'s too big')
		let reason = ctx.args.slice(2).join(' ')
		if (!reason.length) reason = "Non specified"
		if (reason.includes('/')) return ctx.send('Sorry but your reason contain an unautorised caracter : `/`')
		const embedBanned = new BetterEmbed({
			title: "You were tempbanned from "+ ctx.guild?.name ?? "None, wait what ?",
			description: "<a:banhammer:844881353841442826> Reason : `" + reason +"`\nTime: "+ ctx.args[1]
		})
		const embedBanner = new BetterEmbed({
			title: "Case update",
			description: `${member} have been succefuly tempbanned from ${ctx.guild?.name}`
		})
		member?.send(embedBanned).catch(() => {
			embedBanner.footer = {
				text: `An error aucured when I tried to dm this user`
			}
		})
		
		member.ban({reason: ctx.args.slice(1).join(' ') + " | Opered by " + ctx.member?.displayName}).then(async m => {
			let created = await create("casier", ["id", m.id], ["guilds, reasons, mods, type", `"${ctx.guild?.id}", "${reason}", "${ctx.author.id}, "tempban"`])
			if (!created) {
				query(`SELECT * FROM casier WHERE id = "${m.id}"`, (err: MysqlError|null, res: any) => {
					if (err) return console.log(err)
					res = res[0]
					query(`UPDATE casier SET guilds = "${res.guilds + "/" + ctx.guild?.id}", reasons = "${(res.reasons).toString() + "/" + reason}",  mods = "${res.mods + "/" + ctx.author.id}", type = "${res.type + "/tempban"}" WHERE id = "${m.id}"`, (err: MysqlError|null, test: any) => {
						if (err) return console.log(err)
					})
                    query(`INSERT INTO temp (id, guild, type, date, time) VALUES ("${m.id}", "${ctx.guild?.id}", "ban", "${Date.now()}", "${time}")`)
				})
			}
			ctx.delete()
			ctx.send(embedBanner)
			sendToModLogs(ctx.guild, `<a:banhammer:844881353841442826> ${member} by ${ctx.member} | reason : ${reason} | time : ${ctx.args[1]}`, "tempban")
		})
    }
)