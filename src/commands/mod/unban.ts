import { Command, CommandHandler, BetterEmbed, Tag } from 'advanced-command-handler'
import { Context } from '../../class/Context'
import { getUserFromMention } from '../../functions/get'
import { sendToModLogs } from '../../functions/logging'


export default new Command(
	{
		name: 'unban',
		description: 'Let speak without the banhammer',
		aliases: ['ub'],
		tags: [Tag.guildOnly],
		cooldown: 5,
        usage: 'unban [memberID]',
        clientPermissions: ['BAN_MEMBERS'],
        userPermissions: ['BAN_MEMBERS', 'KICK_MEMBERS']
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        if (!ctx.args[0]) return ctx.send("You have to provide an user")
        if (isNaN(Number(ctx.args[0])) || !(ctx.args[0].length >= 17 && ctx.args[0].length <= 19)) return ctx.send('You have to provide an ID')
        
        ctx.guild?.fetchBans().then(bans=> {
            let userBanned = bans.find(b => b.user.id == ctx.args[0])
            if(!userBanned) return ctx.send("This user isn't banned")
            ctx.guild?.members.unban(userBanned.user).then(() => {
                ctx.delete()
                const embedBanner = new BetterEmbed({
                    title: "Case update",
                    description: `${userBanned?.user.username} have been succefuly unbanned from ${ctx.guild?.name}`,
                    color: "GREEN"
                })
                ctx.send(embedBanner)
                sendToModLogs(ctx.guild, `<a:banhammer:844881353841442826> ${userBanned?.user} by ${ctx.member}`, "unban")
            }).catch(() => ctx.send("I can't unban this user."))
        })
    }
)