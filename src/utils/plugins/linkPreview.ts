import { GuildTextChannelResolvable, Message, MessageActionRow, MessageButton, MessageEmbed, NewsChannel, TextChannel, WebhookClient } from "discord.js";
import { getWebhook } from "../functions/get";

export const linkPreview = async (message: Message) => {
        let messageLink = message.content.replace(/discord.com/g,"discordapp.com").split("discordapp.com/channels/")[1]
        let channel = messageLink.split("/")[1]
        let msg = messageLink.split("/")[2].slice(0,18)
        if (message.client?.channels.cache.get(channel)) {
            (message.client?.channels.cache.get(channel) as TextChannel|NewsChannel)?.messages.fetch(msg).then(async m => {
                    if (!message.guild) return
                    const embeds = m.embeds
                    const row = new MessageActionRow({
                        components: [
                            new MessageButton({
                                label: "Jump to original",
                                style: "LINK",
                                url: m.url
                            }),
                            new MessageButton({
                                label: "Jump to source",
                                style: "LINK",
                                url: message.url
                            }),
                            new MessageButton({
                                emoji: "🗑️",
                                style: "DANGER",
                                customId: "close"
                            })
                        ]
                    })
                    await message.channel.send({
                        allowedMentions: {
                            repliedUser: false,
                            roles: [],
                            users: [],
                        },
                        content: m.content,
                        embeds: embeds,
                        files: m.attachments.map(a => a),
                        components: [row]
                    }).then(async (m) => {
                        const id = message.author.id
                        const collector = m.createMessageComponentCollector({
                            componentType: "BUTTON"
                        })
                        collector.on("collect", _ => {
                            if (_.user.id !== id) return _.deferUpdate()
                            m.delete()
                            collector.stop()
                        })
                    })
                
            })
        }
}