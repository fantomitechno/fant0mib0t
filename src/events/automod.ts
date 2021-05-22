import { BetterEmbed, CommandHandler, Event } from 'advanced-command-handler'
import { Message } from 'discord.js'
import { MysqlError } from 'mysql'
import fetch from "node-fetch"
import { create, query } from '../functions/db'
import { sendToModLogs } from '../functions/logging'
import { countUpperCase } from '../functions/string'



const automod = {
    antilink: true,
    linkAuto: ["766376963694657586", "539497487510011915"],
    uppercase: true,
    spam: true,
    dupplicated: true
}

let spam: any = {}
let spam2: any = {}



export default new Event(
    {
        name: 'automod'
    },
    async (handler: typeof CommandHandler, message: Message): Promise<any> => {
        if (message.member?.hasPermission("MANAGE_MESSAGES")) return
        const str2 = message.content.match(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/(\w+)/)
        if (automod.antilink && str2) {
                
            const motbl = str2.slice(5)
                
            fetch(`https://discordapp.com/api/v6/invites/${motbl}`)
            .then(async (res: any) => res.json())
            .then(async (json: any) => {
                if (automod.linkAuto.includes(json.guild.id)) return
                message?.delete()
                const reason = `Tried to send a link to another discord | Automated warn`
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
                let created = await create("casier", ["id", message.member?.id], ["guilds, reasons, mods, type", `"${message.guild?.id}", "${reason}", "${handler.client?.user?.id}, "warn"`])
                if (!created) {
                    query(`SELECT * FROM casier WHERE id = "${message.member?.id}"`, (err: MysqlError|null, res: any) => {
                        if (err) return console.log(err)
                        res = res[0]
                        query(`UPDATE casier SET guilds = "${res.guilds + "/" + message.guild?.id}", reasons = "${(res.reasons).toString() + "/" + reason}",  mods = "${res.mods + "/" + handler.client?.user?.id}", type = "${res.type + "/warn"}" WHERE id = "${message.member?.id}"`, (err: MysqlError|null, _: any) => {
                            if (err) return console.log(err)
                        })
                    })
                }
                message.channel.send(embedBanner)
                sendToModLogs(message.guild, `<a:banhammer:844881353841442826> ${message.member} by AutoMod sys | reason : ${reason}\n\nMessage: \`\`${message.content}\`\``, "autowarn")
            })
        }
        if (automod.uppercase && message.content.length > 6 && countUpperCase(message.content)/(message.content.match(/[A-z]/g) ?? []).length > 0.80) {
            message?.delete()
            const reason = `Too much uppercase | Automated warn`
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
            let created = await create("casier", ["id", message.member?.id], ["guilds, reasons, mods, type", `"${message.guild?.id}", "${reason}", "${handler.client?.user?.id}, "warn"`])
            if (!created) {
                query(`SELECT * FROM casier WHERE id = "${message.member?.id}"`, (err: MysqlError|null, res: any) => {
                    if (err) return console.log(err)
                    res = res[0]
                    query(`UPDATE casier SET guilds = "${res.guilds + "/" + message.guild?.id}", reasons = "${(res.reasons).toString() + "/" + reason}",  mods = "${res.mods + "/" + handler.client?.user?.id}", type = "${res.type + "/warn"}" WHERE id = "${message.member?.id}"`, (err: MysqlError|null, _: any) => {
                        if (err) return console.log(err)
                    })
                })
            }
            message.channel.send(embedBanner)
            sendToModLogs(message.guild, `<a:banhammer:844881353841442826> ${message.member} by AutoMod sys | reason : ${reason}\n\nMessage: \`\`${message.content}\`\``, "autowarn")
        }
        if (automod.dupplicated) {
            const regexp = /(\S+)([\t ]*)(?:\1\2?){5,}/g
            if (regexp.test(message.content.toLowerCase())) {
                if (message.content.length < 5) return
                message?.delete()
                const reason = `Mass duplicated characters | Automated warn`
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
                let created = await create("casier", ["id", message.member?.id], ["guilds, reasons, mods, type", `"${message.guild?.id}", "${reason}", "${handler.client?.user?.id}, "warn"`])
                if (!created) {
                    query(`SELECT * FROM casier WHERE id = "${message.member?.id}"`, (err: MysqlError|null, res: any) => {
                        if (err) return console.log(err)
                        res = res[0]
                        query(`UPDATE casier SET guilds = "${res.guilds + "/" + message.guild?.id}", reasons = "${(res.reasons).toString() + "/" + reason}",  mods = "${res.mods + "/" + handler.client?.user?.id}", type = "${res.type + "/warn"}" WHERE id = "${message.member?.id}"`, (err: MysqlError|null, _: any) => {
                            if (err) return console.log(err)
                        })
                    })
                }
                message.channel.send(embedBanner)
                sendToModLogs(message.guild, `<a:banhammer:844881353841442826> ${message.member} by AutoMod sys | reason : ${reason}\n\nMessage: \`\`${message.content}\`\``, "autowarn")
            }
        }
        if (automod.spam) {
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

            if (spam[message.author.id] && spam[message.author.id] > 2) {
                message?.delete()
                const reason = `Spam of "${message.content}" | Automated warn`
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
                let created = await create("casier", ["id", message.member?.id], ["guilds, reasons, mods, type", `"${message.guild?.id}", "${reason}", "${handler.client?.user?.id}, "warn"`])
                if (!created) {
                    query(`SELECT * FROM casier WHERE id = "${message.member?.id}"`, (err: MysqlError|null, res: any) => {
                        if (err) return console.log(err)
                        res = res[0]
                        query(`UPDATE casier SET guilds = "${res.guilds + "/" + message.guild?.id}", reasons = "${(res.reasons).toString() + "/" + reason}",  mods = "${res.mods + "/" + handler.client?.user?.id}", type = "${res.type + "/warn"}" WHERE id = "${message.member?.id}"`, (err: MysqlError|null, _: any) => {
                            if (err) return console.log(err)
                        })
                    })
                }
                message.channel.send(embedBanner)
                sendToModLogs(message.guild, `<a:banhammer:844881353841442826> ${message.member} by AutoMod sys | reason : ${reason}`, "autowarn")
            } else if (spam2[message.author.id] && spam2[message.author.id] > 2) {
                message?.delete()
                const reason = `Spam of multiple messages | Automated warn`
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
                let created = await create("casier", ["id", message.member?.id], ["guilds, reasons, mods, type", `"${message.guild?.id}", "${reason}", "${handler.client?.user?.id}, "warn"`])
                if (!created) {
                    query(`SELECT * FROM casier WHERE id = "${message.member?.id}"`, (err: MysqlError|null, res: any) => {
                        if (err) return console.log(err)
                        res = res[0]
                        query(`UPDATE casier SET guilds = "${res.guilds + "/" + message.guild?.id}", reasons = "${(res.reasons).toString() + "/" + reason}",  mods = "${res.mods + "/" + handler.client?.user?.id}", type = "${res.type + "/warn"}" WHERE id = "${message.member?.id}"`, (err: MysqlError|null, _: any) => {
                            if (err) return console.log(err)
                        })
                    })
                }
                message.channel.send(embedBanner)
                sendToModLogs(message.guild, `<a:banhammer:844881353841442826> ${message.member} by AutoMod sys | reason : ${reason}`, "autowarn")
            }
        }
    }
)