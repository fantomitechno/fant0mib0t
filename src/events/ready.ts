import { CommandHandler, Event, Logger } from 'advanced-command-handler'
import { ClientUser, PresenceData } from 'discord.js'
import { presence } from '../config.json'

export default new Event(
    {
        name: 'ready'
    },

    async (handler: typeof CommandHandler): Promise<any> => {
        function log() {
            Logger.event(`Date : ${Logger.setColor('yellow', new Date().toString())}`);
            Logger.event(`RAM used : ${Logger.setColor('magenta', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2))} ` + Logger.setColor('magenta', 'MB'));
        }
        
        Logger.event(
            `Client online ! Client ${Logger.setColor('orange', handler.client?.user?.username)} has ${handler.client?.guilds.cache.size} guilds, it sees ${
                handler.client?.users.cache.size
            } users.`
        )
    
        log()
        setInterval(() => {
            log();
        }, 20 * 60 * 1000)
    
        const user = handler?.client?.user
    
    
        if (presence.activated) {
            let status: any = presence.list[0]
            user?.setPresence(status)
            let i = 1
            setInterval(() => {
                status = presence.list[i]
                user?.setPresence(status)
                i ++
                if (i === presence.list.length) i = 0
            },
            presence.time)
        }
    }
)