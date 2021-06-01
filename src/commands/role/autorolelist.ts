import { BetterEmbed, Command, CommandHandler, Tag } from 'advanced-command-handler'
import { MysqlError } from 'mysql'
import { Context } from '../../class/Context'
import { query } from '../../functions/db'


export default new Command(
	{
		name: 'autorolelist',
		description: 'List all the tiny thing that your members can have',
		aliases: ['arl'],
		tags: [Tag.guildOnly],
		cooldown: 5,
        usage: 'autorolelist',
        userPermissions: ['MANAGE_ROLES']
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        const embed = new BetterEmbed({
            title: "List of autorole on "+ctx.guild?.name,
            footer: {
                text: "Requested by "+ ctx.author.username
            }
        })
        query(`SELECT * FROM autorole WHERE server_id = "${ctx.guild?.id}"`, (err: MysqlError, res: any) => {
            if (!res.length) {
                embed.description = `There's no autorole on this server`
            } else {
                let channel: any = {}
                for (const result of res) {
                    channel[result.channel_id] = []
                }
                for (const result of res) {
                    channel[result.channel_id].push(result.message_id)
                }
                const list = Object.keys(channel)
                for (const c of list) {
                    embed.fields.push({
                        name: `In ${ctx.guild?.channels.cache.get(c)?.name}`,
                        value: "<#"+c+"> \n - "+channel[c].map((id: string) => `[Here](https://discord.com/channels/${c}/${id})`).join('\n - '),
                        inline: false
                    })
                }
            }
            ctx.send(embed)
        })
    }
)