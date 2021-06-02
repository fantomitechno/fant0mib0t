import { CommandHandler, Event } from 'advanced-command-handler'
import { Guild } from 'discord.js'
import { MysqlError } from 'mysql'
import { query } from '../functions/db'
import { SConfig } from '../type/Database'

export default new Event(
    {
        name: 'guildCreate'
    },

    async (handler: typeof CommandHandler, guild: Guild): Promise<any> => {
        guild.systemChannel?.createWebhook("fant0mib0t-webhook", {
            avatar: guild.client?.user?.avatarURL() ?? undefined,
            reason: "Don't touch this !"
        }).then(_ => {
            query(`SELECT * FROM config WHERE guild = "${guild.id}"`, (err: MysqlError, res: SConfig[]) => {
                if (!res.length) query(`INSERT INTO config (guild, config) VALUES ("${guild.id}", '{"automod":{"antilink": true, "uppercase":true, "spam":true, "dupplicated":true}, "antilinkBypass": "", "linkPreview":true}')`)
            })
        })
    }
)