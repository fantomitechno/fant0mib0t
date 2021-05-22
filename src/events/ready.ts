import { CommandHandler, Event, Logger } from 'advanced-command-handler'
import { MysqlError } from 'mysql';
import { presence, database } from '../config.json'
import { query } from '../functions/db';
import { sendToModLogs } from '../functions/logging';

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

        setInterval(() => {
            query("SELECT *", () => {
                log()
            })
        }, database.refresh_time)


        setInterval( () => {
            Logger.event(
                `Starting temps loop..`
            )
            query("SELECT * FROM temp", (err: MysqlError, result: any) => {
                for (const res of result) {
                    const timePassed = Date.now() - res.date
                    if (timePassed >= res.time) {
                        const guild = handler.client?.guilds.cache.get(res.guild)
                        if (guild) {
                            if (res.type === "ban") {
                                guild.fetchBans().then(bans => {
                                    let userBanned = bans.find(b => b.user.id === res.id)
                                    if (!userBanned) return
                                    guild.members.unban(userBanned.user).then(() => {
                                        sendToModLogs(guild, `<a:banhammer:844881353841442826> ${userBanned?.user}`, "unban (auto)")
                                    })
                                })
                            } else if (res.type === "mute") {
                                let member = guild.members.cache.get(res.id)
                                if (!member) return
                                let mutedRole = guild?.roles.cache.find(r => r.name.includes("mute") && !r.managed)?.id ?? "0"
                                if (!member.roles.cache.has(mutedRole)) return
                                query(`SELECT * FROM mute WHERE id = "${member.id}" AND guild = "${guild?.id}"`, (err: MysqlError|null, res: any) => {
                                    if (err) return console.log(err)
                                    if (res.length) {
                                        query(`DELETE FROM mute WHERE id = "${member?.id}" AND guild = "${guild?.id}"`)
                                    }
                                })
                                member.roles.remove(mutedRole, "Automatic").then(async m => {
                                    sendToModLogs(guild, `<a:banhammer:844881353841442826> ${member}`, "unmute (auto)")
                                })
                            }
                        }
                        query(`DELETE FROM temp WHERE id = "${res.id}" AND guild = "${res.guild}" AND type = "${res.type}" AND time = "${res.time}" AND date = "${res.date}"`)
                    }
                }
            })
            Logger.event(
                `Temps loop ended`
            )
        }, 60000)

        const autoRoleFetch = async() => {
            Logger.event(`Fetching autorole..`)
            query("SELECT * FROM autorole",(err: MysqlError, results: any) => {
                if (!results.length) return
                results.map((r: any) => {
                    let server = handler.client?.guilds.cache.get(r.server_id)
                    if (server) {
                        let channel: any = server.channels.cache.get(r.channel_id)
                        if (channel?.isText) {
                            channel.messages.fetch(r.message_id).then((msg: any) => {
                                msg
                            }).catch((err: any) => console.log(err))
                        }
                    }
                })
            })
            Logger.event(`Autorole are fetched`)
        }

        setInterval(() => autoRoleFetch, 36000000)

        autoRoleFetch()
        log()
    }
)