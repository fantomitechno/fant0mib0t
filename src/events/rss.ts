import { CommandHandler, Event } from 'advanced-command-handler'
import { MysqlError } from 'mysql'
import { query } from '../utils/functions/db'
import { rss } from '../utils/type/Database'

export default new Event(
    {
        name: 'rss'
    },

    async (handler: typeof CommandHandler): Promise<any> => {
        query(`SELECT * FROM rss`, (err: MysqlError, res: rss[]) => {
            for (const rss of res) {
                if (rss.type === "twitch") {
                    
                }
            }
        })
    }
)