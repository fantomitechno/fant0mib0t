import { Command, CommandHandler, Tag } from 'advanced-command-handler'
import { MysqlError } from 'mysql';
import { Context } from '../../utils/class/Context';
import { query } from '../../utils/functions/db';
import { getWebhook } from '../../utils/functions/get';
import { SConfig } from '../../utils/type/Database';


export default new Command(
	{
		name: 'reset',
		description: "Reset the current server",
        tags: [Tag.ownerOnly, Tag.guildOnly]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        if (!ctx.guild) return
        let text = `Reset : `
        getWebhook(ctx.guild)
        query("SELECT * FROM config WHERE guild = '"+ctx.guild.id+"'", async (err: MysqlError, res: SConfig[]) => {
            if (!res.length) {
                query(`INSERT INTO config (guild, config, webhook) VALUES ("${ctx.guild?.id}", '{"automod":{"antilink": true, "uppercase":true, "spam":true, "dupplicated":true}, "antilinkBypass": null, "linkPreview":true, "dynamicVoiceBase": null}')`)
                text += `\nCreated a sconfig`
            } else {
                query(`DELETE FROM config WHERE guild = "${ctx.guild?.id}"`)
                query(`INSERT INTO config (guild, config, webhook) VALUES ("${ctx.guild?.id}", '{"automod":{"antilink": true, "uppercase":true, "spam":true, "dupplicated":true}, "antilinkBypass": null, "linkPreview":true, "dynamicVoiceBase": null}')`)
                text += `\nReseted the sconfig`
            }
        })
	}
);