import { Command, CommandHandler, Tag } from 'advanced-command-handler'
import { NewsChannel, TextChannel } from 'discord.js';
import { MysqlError } from 'mysql';
import { Context } from '../../utils/class/Context'
import { query } from '../../utils/functions/db';
import { autorole } from '../../utils/type/Database';


export default new Command(
	{
		name: 'autoroledelete',
		description: 'Delete a tiny thing that your members can have\nThe forceDel argument is a boolean (`true`/`false`)',
		aliases: ['ard'],
		tags: [Tag.guildOnly],
		cooldown: 5,
        usage: 'autoroledelete <messageID> [forceDel]',
        clientPermissions: ['MANAGE_ROLES', 'ADD_REACTIONS'],
        userPermissions: ['MANAGE_ROLES']
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        if (!ctx.args[0]) return ctx.send('You have to enter a message ID')
        if (isNaN(Number(ctx.args[0])) || !(ctx.args[0].length >= 17 && ctx.args[0].length <= 19)) return ctx.send('You have to provide an ID')
        query(`SELECT * FROM autorole WHERE message_id = "${ctx.args[0]}"`, (err: MysqlError, res: autorole[]) => {
            if (res.length !== 1) return ctx.send("The ID you provided is not registred as a role react message ID")
            const resEdit = res[0]
            if (resEdit.server_id !== ctx.guild?.id) return ctx.send('The ID you provided is not in this server, you have no permission on this')
            const channel = ctx.guild?.channels.cache.get(resEdit.channel_id)
            if (!channel?.isText) return
            const message = (channel as TextChannel|NewsChannel).messages.cache.get(resEdit.message_id)
            let text = "Role reaction succefuly deleted"
            if (ctx.args[1] && Boolean(ctx.args[1])) message?.delete(), text += "\nMessage delete too"
            query(`DELETE FROM autorole WHERE message_id = "${ctx.args[0]}"`)
            ctx.send(text)
        })
    }
)