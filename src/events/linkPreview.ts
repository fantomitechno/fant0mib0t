import { BetterEmbed, CommandHandler, Event } from 'advanced-command-handler'
import { Message, MessageEmbed, NewsChannel, TextChannel } from 'discord.js'
import { getWebhook } from '../utils/functions/get'

export default new Event(
    {
        name: 'linkPreview'
    },
    async (handler: typeof CommandHandler, message: Message): Promise<any> => {
        if (message.content.replace(/discord.com/g,"discordapp.com").includes("discordapp.com/channels/")) {
            console.log('t')
            let messageLink = message.content.replace(/discord.com/g,"discordapp.com").split("discordapp.com/channels/")[1]
            let server = messageLink.split("/")[0]
            let channel = messageLink.split("/")[1]
            let msg = messageLink.split("/")[2].slice(0,18)
                if (handler.client?.channels.cache.get(channel)) {
                    (handler.client?.channels.cache.get(channel) as TextChannel|NewsChannel)?.messages.fetch(msg).then(async m => {
                            if (!message.guild) return
                            const w = await getWebhook(message.guild)
                            if (!w) return
                            await w.edit({channel: message.channel})
                            const embeds = m.embeds
                            const embed = new BetterEmbed({
                                description: `[Jump to](https://discord.com/channels/${server}/${channel}/${msg})`
                            })
                            embeds.push(embed)
                            await w.send(m.content, {
                                embeds: embeds,
                                files: m.attachments.map(a => a),
                                username: m.member?.displayName ?? m.author.username,
                                avatarURL: m.author.avatarURL() ?? undefined
                            }).then(async (m: Message) => {
                                let msg_1 = m
								await msg_1.react('🗑️')
								const id = message.author.id
								const collector = msg_1.createReactionCollector((reaction, user) => reaction.emoji.name === "🗑️" && user.id == id, {time: 600000})
								collector.on("collect", _ => {
									msg_1.delete()
									collector.stop()
								})
								collector.on("end", (_, r) => {
									if (r === "time") msg_1.reactions.removeAll()
								})
							})
                        
                    })
                }
        }
    }
)