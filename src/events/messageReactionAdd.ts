import { CommandHandler, Event } from 'advanced-command-handler'
import { MessageReaction, User } from 'discord.js'
import { MysqlError } from 'mysql'
import { query } from '../utils/functions/db'
import { autorole } from '../utils/type/Database'

export default new Event(
    {
        name: 'messageReactionAdd'
    },
    async (handler: typeof CommandHandler, messageReaction: MessageReaction, user: User): Promise<any> => {
        if (!messageReaction.message.guild) return
        query("SELECT * FROM autorole WHERE message_id = " + messageReaction.message.id, (err: MysqlError, results: autorole[]) => {
            if (results.length == 1) {
                let roleList = JSON.parse(results[0].role.toString())
                if (roleList[messageReaction.emoji.name]) {
                    handler.client?.guilds.cache.get(results[0].server_id)?.members.cache.get(user.id)?.roles.add(roleList[messageReaction.emoji.name])
                } else if (messageReaction.emoji.id && roleList[messageReaction.emoji.id]) {
                    handler.client?.guilds.cache.get(results[0].server_id)?.members.cache.get(user.id)?.roles.add(roleList[messageReaction.emoji.id])
                }
            }
        })
    }
)