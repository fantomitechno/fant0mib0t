import { Command, CommandHandler, BetterEmbed, Tag } from 'advanced-command-handler'
import { MysqlError } from 'mysql'
import { Context } from '../../class/Context'
import { create, query } from '../../functions/db'
import { getUserFromMention } from '../../functions/get'
import { sendToModLogs } from '../../functions/logging'

const typesWarn: any = {"bans": "ban", "kicks": "kick", "mutes": "mute", "warns": "warn"}
export default new Command(
	{
		name: 'unwarn',
		description: 'Let speak without the very soft banhammer',
		aliases: ['uw','uwu'],
		tags: [Tag.guildOnly],
		cooldown: 3,
        usage: 'unwarn [member] [id]',
        clientPermissions: [],
        userPermissions: ["MANAGE_MESSAGES"]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        const member = getUserFromMention(ctx.message, ctx.args[0])
        if (!member) return ctx.send('The member you provided is not available. Have you gived a valide member ?')
		const type = ctx.args[1]
        if (!type) return ctx.send('You must indicate the type of the warn.')
        if (!typesWarn[type]) return ctx.send('The type of the warn is not found.')

		if (!ctx.args[2]) return ctx.send('You must indicate the id of the warn.')
		const id: number = Number(ctx.args[2])
		if (isNaN(id)) return ctx.send('Id must be a number.')

        query(`SELECT * FROM casier WHERE id = ${member.id}`, (err: MysqlError|null, res: any) => {
            if (err) return console.log(err)
            const casier: any = {}
            
            res = res[0]
            let guilds = res.guilds.split('/')
            let reasons = res.reasons.toString().split('/')
            let mods = res.mods.split('/')
            let types = res.type.split('/')

            for (const guild of guilds) {
                casier[guild] = {
                    ban: [],
                    kick: [],
                    mute: [],
                    warn: []
                }
            }
            for (let i = 0; i < guilds.length; i++) {
                casier[guilds[i]][types[i]].push({
                    reason: reasons[i],
                    mod: mods[i]
                })
            }
            if (!ctx.guild) return
            const warnList = casier[ctx.guild?.id][typesWarn[type]].map((r: any) => r)
            if (id < 0 || id > warnList.length) return ctx.send('The id is not found.')
            casier[ctx.guild?.id][typesWarn[type]].splice(id, 1)

            guilds = []
            reasons = []
            mods = []
            types = []

            for (const [key, value] of Object.entries(casier)) {
                for (const [key2, value2] of Object.entries((value as any))) {
                    for (const warn of (value2 as any)) {
                        guilds.push(key)
                        types.push(key2)
                        reasons.push(warn.reason)
                        mods.push(warn.mod)
                    }
                }
            }

		    const embedBanner = new BetterEmbed({
		    	title: "Case update",
		    	description: `${member} have been succefuly unwarned on ${ctx.guild?.name}`,
                color: "GREEN"
		    })
			query(`UPDATE casier SET guilds = "${guilds.join("/")}", reasons = "${reasons.join("/")}",  mods = "${mods.join("/")}", type = "${types.join("/")}" WHERE id = "${member.id}"`, (err: MysqlError|null, _: any) => {
				if (err) return console.log(err)
			})
            ctx.delete()
            ctx.send(embedBanner)
            sendToModLogs(ctx.guild, `<a:banhammer:844881353841442826> ${member} by ${ctx.member}`, "unwarn")
		})
    }
)
