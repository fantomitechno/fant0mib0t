import { Command, CommandHandler, Tag } from 'advanced-command-handler'
import { Context } from '../../utils/class/Context';


export default new Command(
	{
		name: 'alert',
		description: "DANGER ZONE, DON'T TOUCH ANYTHING",
        tags: [Tag.ownerOnly],
		aliases: ['panic']
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        ctx.send(`<a:red_alert:849643442514296843> You're entering the danger zone, the command you runned is WORTHER than the shutdown :\nThis command have to be used in an absolute need !\n\nWhat will appen after you touch the red button :\nThe bot will leave all his guild and DM the owner of the situation\n\nExact message :\`\`\` \`\`\`\n<a:red_alert:849643442514296843> Hi, I'm one of your server ({guild.name}) bots. My token have been leaked and my owners decided to enter the danger zone : I have to leave your server so you can't be raided by me. For more informations, go on my Discord server : <http://discord.gg/x9BMZ6z>\`\`\` \`\`\``).then(async m => {
            await m.react('🔴')
            await m.react('🚫')
            const col = m.createReactionCollector((reaction, user) => ['🔴','🚫'].includes(reaction.emoji.name) && user.id == ctx.author.id, {time: 30000})
            col.on('collect', (r, _) => {
                col.stop()
                m.delete()
                if (r.emoji.name === '🔴') {
                    ctx.send(`You pressed the red button, good bye master <:salute:849646594759721041>`)
                    handler.client?.guilds.cache.map(g => {
                        g.owner?.send(`<a:red_alert:849643442514296843> Hi, I'm on one of your servers (${g.name}). My token have been leaked and my owners decided to enter the danger zone : I have to leave your server so you can't be raided by me. For more informations, go on my Discord server : <http://discord.gg/x9BMZ6z>`).catch(e => e).then(_ => {
                            g.leave()
                        })
                    })
                }
                else ctx.send(`Canceled, NEVER DO THAT AGAIN`)
            })
        })
    }
);