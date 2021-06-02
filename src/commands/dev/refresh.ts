import { Command, CommandHandler, Tag } from 'advanced-command-handler'
import { MysqlError } from 'mysql';
import { Context } from '../../class/Context';
import { query } from '../../functions/db';
import { getWebhook } from '../../functions/get';
import { SConfig } from '../../type/Database';


export default new Command(
	{
		name: 'refresh',
		description: "Refresh the current server",
        tags: [Tag.ownerOnly, Tag.guildOnly]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        if (!ctx.guild) return
        getWebhook(ctx.guild)
        query("SELECT * FROM config WHERE guild = '"+ctx.guild.id+"'", async (err: MysqlError, res: SConfig[]) => {
            if (!res.length) {
                query(`INSERT INTO config (guild, config, webhook) VALUES ("${ctx.guild?.id}", '{"automod":{"antilink": true, "uppercase":true, "spam":true, "dupplicated":true}, "antilinkBypass": "", "linkPreview":true}')`)
                ctx.send("Created a configuration for this server")
            } else ctx.send("This server already have a configuration")
        })
	}
);