import { BetterEmbed, CommandHandler, Event } from 'advanced-command-handler'
import { Message } from 'discord.js'
import { MysqlError } from 'mysql'
import fetch from "node-fetch"
import { query } from '../functions/db'
import { sendToModLogs } from '../functions/logging'
import { countUpperCase } from '../functions/string'
import { Config } from '../type/Config'

let spam: any = {}
let spam2: any = {}

export default new Event(
    {
        name: 'automod'
    },
    async (handler: typeof CommandHandler, message: Message, config: Config): Promise<any> => {
        if (message.member?.hasPermission("MANAGE_MESSAGES")) return
        const str2 = message.content.match(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/(\w+)/)
        if (config.automod.antilink && str2) {
                
            const motbl = str2.slice(5)
                
            fetch(`https://discordapp.com/api/v6/invites/${motbl}`)
            .then(async (res: any) => res.json())
            .then(async (json: any) => {
                if (config.antilinkBypass?.includes(json.guild.id)) return
                Mod(message, handler, `Tried to send a link to another discord | Automated warn`)
            })
        }
        if (config.automod.uppercase && message.content.length > 10 && countUpperCase(message.content)/(message.content.match(/[A-z]/g) ?? []).length > 0.80) {
            Mod(message, handler, `Too much uppercase | Automated warn`)
        }
        const regexp = /(\S+)([\t ]*)(?:\1\2?){7,}/g
        if (config.automod.dupplicated && regexp.test(message.content.toLowerCase()) && message.content.length > 5) {
            Mod(message, handler, `Mass duplicated characters | Automated warn`)
        }
        if (config.automod.spam) {
            if (!spam[message.author.id] || spam[message.author.id] === 0) {
                spam[message.author.id] = 1
                let antispam = setInterval(function() {
                    spam[message.author.id] = 0
                    clearInterval(antispam)
                },1000)
            } else {
                spam[message.author.id] += 1
            }
    
            if (!spam2[message.author.id] || spam2[message.author.id][0] === 0 || spam2[message.author.id][1] !== message.content) {
                spam2[message.author.id] = [1, message.content]
                let antispam2 = setInterval(function() {
                    spam2[message.author.id] = [0, message.content]
                    clearInterval(antispam2)
                },100000)
            } else if (spam2[message.author.id][1] === message.content) {
                spam2[message.author.id] = [spam2[message.author.id][0] + 1, spam2[message.author.id][1]]
            }

            if (spam[message.author.id] && spam[message.author.id] > 3) {
                Mod(message, handler, `Spam of "${message.content}" | Automated warn`)
            } else if (spam2[message.author.id] && spam2[message.author.id] > 3) {
                Mod(message, handler, `Spam of multiple messages | Automated warn`)
            }
        }
    }
)

const Mod = async (message: Message, handler: typeof CommandHandler, reason: string) => {
    message?.delete()
    const embedBanned = new BetterEmbed({
        title: "You were warned on "+ message.guild?.name ?? "None, wait what ?",
        description: "<a:banhammer:844881353841442826> Reason : `" + reason +"`",
        color: "RED"
    })
    const embedBanner = new BetterEmbed({
        title: "Case update",
        description: `${message.member} have been succefuly warned on ${message.guild?.name}`,
        color: "GREEN"
    })
    message.member?.send(embedBanned).catch(() => {
        embedBanner.footer = {
            text: `An error aucured when I tried to dm this user`
        }
    })
    query(`SELECT * FROM casier WHERE id = "${message.member?.id}"`, (err: MysqlError|null, res: any) => {
        if (err) return console.log(err)
        if (!res.length) {
            query(`INSERT INTO casier (id, guilds, type, reasons, mods) VALUES ("${message.member?.id}", "${message.guild?.id}", "warn", "${reason}", "${handler.client?.user?.id}")`)
        } else {
            res = res[0]
            query(`UPDATE casier SET guilds = "${res.guilds + '▪' + message.guild?.id}", reasons = "${(res.reasons).toString() + '▪' + reason}",  mods = "${res.mods + '▪' + handler.client?.user?.id}", type = "${res.type + "▪warn"}" WHERE id = "${message.member?.id}"`)
        }
    })
    message.channel.send(embedBanner)
    sendToModLogs(message.guild, `<a:banhammer:844881353841442826> ${message.member} by AutoMod sys | reason : ${reason} | Message : ${message.content}`, "autowarn")
}
