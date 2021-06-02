import { BetterEmbed, Command, CommandHandler, Tag } from 'advanced-command-handler';
import { MysqlError } from 'mysql';
import { Context } from '../../class/Context';
import { query } from '../../functions/db';
import { getRole } from '../../functions/get';
import { selfrole } from '../../type/Database';


export default new Command(
	{
		name: 'selfrole', 
        aliases: ["sr", "self"],
		description: "Get a self asignable role",
		clientPermissions: ['MANAGE_ROLES'],
		userPermissions: [],
		tags: [Tag.guildOnly]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
		if (!ctx.args[0]) return sendList(ctx)
		query(`SELECT * FROM selfrole WHERE tag = "${ctx.args[0]}" AND guild ="${ctx.guild?.id}"`, async(err: MysqlError, res: selfrole[]) => {
			if (!res.length) return sendList(ctx)
			const resEdit = res[0]
            ctx.member?.roles.add(resEdit.role)
            ctx.send(`Role <@&${resEdit.role}> gived`, {disableMentions: 'all'})
		})
	}
);

const sendList = async (ctx: Context) => {
    query('SELECT * FROM selfrole WHERE guild = "'+ctx.guild?.id+'"', (err: MysqlError, res: selfrole[]) => {
        let text = `These roles can be gived to you by typing : \`selfrole [tag]\``
        for (const sr of res) {
            text += `\n\`${sr.tag}\` | <@&${sr.role}>`
        }
        const embed = new BetterEmbed({
            title: "Self assignable roles for "+ ctx.guild?.name,
            description: text
        })
        ctx.send(embed)
    })
}