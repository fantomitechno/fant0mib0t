import { CommandHandler, Event } from 'advanced-command-handler'
import { MessageReaction, User } from 'discord.js'
import { MysqlError } from 'mysql'
import { query } from '../functions/db'

export default new Event(
    {
        name: 'messageReactionRemove'
    },
    async (handler: typeof CommandHandler, messageReaction: MessageReaction, user: User): Promise<any> => {
        if (!messageReaction.message.guild) return
        query("SELECT * FROM autorole WHERE message_id = " + messageReaction.message.id, (err: MysqlError, results: any) => {
            if (results.length == 1) {
                let roleList = JSON.parse(results[0].role.toString())
                if (roleList[messageReaction.emoji.name]) {
                    handler.client?.guilds.cache.get(results[0].server_id)?.members.cache.get(user.id)?.roles.remove(roleList[messageReaction.emoji.name])
                } else if (messageReaction.emoji.id && roleList[messageReaction.emoji.id]) {
                    handler.client?.guilds.cache.get(results[0].server_id)?.members.cache.get(user.id)?.roles.remove(roleList[messageReaction.emoji.id])
                }
            }
        })
    }
)