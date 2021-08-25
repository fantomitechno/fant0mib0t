import { Command, CommandHandler, Tag } from 'advanced-command-handler';
import { MysqlError } from 'mysql';
import { Context } from '../../utils/class/Context';
import { query } from '../../utils/functions/db';
import { selfrole } from '../../utils/type/Database';


export default new Command(
	{
		name: 'removeselfrole', 
        aliases: ["rsr"],
		description: "Remove a self asignable role",
		clientPermissions: ['MANAGE_ROLES'],
		userPermissions: ['MANAGE_ROLES'],
		tags: [Tag.guildOnly]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
		if (!ctx.args[0]) return ctx.send('You have to give a valid tag')
		query(`SELECT * FROM selfrole WHERE tag = "${ctx.args[0]}" AND guild ="${ctx.guild?.id}"`, async(err: MysqlError, res: selfrole[]) => {
			if (!res.length) return ctx.send('You have to give a valid tag')
			const resEdit = res[0]
            query(`DELETE FROM selfrole WHERE role = "${resEdit.role}"`)
            ctx.send({disableMentions: 'all', content: `The selfrole for <@&${resEdit.role}> has been removed`})
		})
	}
);