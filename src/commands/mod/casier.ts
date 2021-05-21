import { Command, CommandHandler, BetterEmbed, Tag } from 'advanced-command-handler'
import { GuildMember } from 'discord.js'
import { MysqlError } from 'mysql'
import { Context } from '../../class/Context'
import { query } from '../../functions/db'
import { getUserFromMention } from '../../functions/get'


export default new Command(
	{
		name: 'casier',
		description: 'Let speak with the banhammer',
		aliases: ['case','c'],
		tags: [Tag.guildOnly],
		cooldown: 5,
        usage: 'casier <member>',
        clientPermissions: [],
        userPermissions: []
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        let member: GuildMember|undefined|null = getUserFromMention(ctx.message, ctx.args[0] ?? "fantomitechno")
        if (!member) member = ctx.member
        const casier: any = {}
		query(`SELECT * FROM casier WHERE id = "${member?.id}"`, (err: MysqlError|null, res: any) => {
            if (err) throw err
            if (!res.length) return ctx.send(`${member?.user.tag} has no case`)
            res = res[0]
            const guilds = res.guilds.split('/')
            const reasons = res.reasons.toString().split('/')
            const mods = res.mods.split('/')
            const types = res.type.split('/')
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
            const embed = new BetterEmbed({
                title: "Case for " + member?.user.tag,
                description: "The case cover all the action taken with the bot, if you manualy ban someone it will not be registred"
            })
            if (!ctx.guild) return
            let text = casier[ctx.guild?.id].ban.map((b: { reason: any; mod: any }) => `for \`${b.reason}\` by <@${b.mod}>`).join('\n')
            if (text.length === 0) text = "None"
            embed.fields.push({
                name: "Bans",
                value: text,
                inline: true
            })
            text = casier[ctx.guild?.id].kick.map((b: { reason: any; mod: any }) => `for \`${b.reason}\` by <@${b.mod}>`).join('\n')
            if (text.length === 0) text = "None"
            embed.fields.push({
                name: "Kicks",
                value: text,
                inline: true
            })
            text = casier[ctx.guild?.id].mute.map((b: { reason: any; mod: any }) => `for \`${b.reason}\` by <@${b.mod}>`).join('\n')
            if (text.length === 0) text = "None"
            embed.fields.push({
                name: "Mutes",
                value: text,
                inline: true
            })
            text = casier[ctx.guild?.id].warn.map((b: { reason: any; mod: any }) => `for \`${b.reason}\` by <@${b.mod}>`).join('\n')
            if (text.length === 0) text = "None"
            embed.fields.push({
                name: "Warns",
                value: text,
                inline: true
            })
            ctx.send(embed)
        })
    }
)