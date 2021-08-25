import { Command, CommandHandler, BetterEmbed, Tag } from 'advanced-command-handler'
import { MysqlError } from 'mysql'
import { Context } from '../../utils/class/Context'
import { query } from '../../utils/functions/db'
import { getUserFromMention } from '../../utils/functions/get'
import { sendToModLogs } from '../../utils/functions/logging'


export default new Command(
	{
		name: 'unmute',
		description: 'Let speak witout the sparadra',
		aliases: ['um', "umu"],
		tags: [Tag.guildOnly],
		cooldown: 3,
        usage: 'unmute [member]',
        clientPermissions: ['MANAGE_ROLES'],
        userPermissions: ['MANAGE_MESSAGES']
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        const member = getUserFromMention(ctx.message, ctx.args[0])
        if (!member) return ctx.send('The member you provided is not available. Have you gived a valide member ?')
		let mutedRole = ctx.guild?.roles.cache.find(r => r.name.toLowerCase().includes("mute") && !r.managed)?.id ?? "0"
		if (!member.roles.cache.has(mutedRole)) return ctx.send('This user isn\'t muted')
		const embedBanner = new BetterEmbed({
			title: "Case update",
			description: `${member} have been succefuly unmuted from ${ctx.guild?.name}`,
			color: "GREEN"
		})
		
		query(`SELECT * FROM mute WHERE id = "${member.id}" AND guild = "${ctx.guild?.id}"`, (err: MysqlError|null, res: any) => {
			if (err) return console.log(err)
			if (res.length) {
				query(`DELETE FROM mute WHERE id = "${member.id}" AND guild = "${ctx.guild?.id}"`)
			}
		})
		member.roles.remove(mutedRole, "Opered by " + ctx.member?.displayName).then(async m => {
			ctx.delete()
			ctx.send(embedBanner)
			sendToModLogs(ctx.guild, `<a:banhammer:844881353841442826> ${member} by ${ctx.member}`, "unmute")
		})
    }
)
