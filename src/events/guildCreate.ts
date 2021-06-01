import { CommandHandler, Event } from 'advanced-command-handler'
import { Guild } from 'discord.js'
import { query } from '../functions/db'

export default new Event(
    {
        name: 'guildCreate'
    },

    async (handler: typeof CommandHandler, guild: Guild): Promise<any> => {
        guild.systemChannel?.createWebhook("fant0mib0t-webhook", {
            avatar: guild.client?.user?.avatarURL() ?? undefined,
            reason: "Don't touch this !"
        }).then(_ => {
            query(`INSERT INTO config (guild, config) VALUES ("${guild.id}", '{"automod":{"antilink": true, "uppercase":true, "spam":true, "dupplicated":true}, "antilinkBypass": "", "linkPreview":true}')`)
        })
    }
)