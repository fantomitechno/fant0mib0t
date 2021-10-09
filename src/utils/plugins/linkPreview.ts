import { ContextMenuInteraction, GuildTextChannelResolvable, Message, MessageActionRow, MessageButton, MessageEmbed, NewsChannel, TextChannel, User, WebhookClient } from "discord.js";
import { getWebhook } from "../functions";

export const linkPreview = async (message: Message, interaction?: ContextMenuInteraction) => {
        let messageLink = message.content.replace(/discord.com/g,"discordapp.com").split("discordapp.com/channels/")[1]
        let channel = messageLink.split("/")[1]
        let msg = messageLink.split("/")[2].slice(0,18)
        if (message.client?.channels.cache.get(channel)) {
            (message.client?.channels.cache.get(channel) as TextChannel|NewsChannel)?.messages.fetch(msg).then(async m => {
                    if (!message.guild) return
                    const w = await getWebhook(message.guild)
                    if (!w) return
                    await w.edit({channel: (message.channel as GuildTextChannelResolvable)})
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
                    let str = m.content.length ? m.content : undefined
                    await w.send({
                        allowedMentions: {
                            repliedUser: false,
                            roles: [],
                            users: [],
                        },
                        content: str,
                        embeds: embeds,
                        files: m.attachments.map(a => a),
                        username: m.member?.displayName ?? m.author.username,
                        avatarURL: m.author.avatarURL() ?? m.author.defaultAvatarURL
                    }).then(async (m) => {
                        let botmsg: Message
                        if (interaction) {
                            await interaction.reply({
                                components: [row],
                                content: `${message.author.tag} asked for the preview of the link`
                            })
                            botmsg = (await interaction.fetchReply() as Message)
                        } else {
                            botmsg = await (m as Message).reply({
                                components: [row],
                                content: `${message.author.tag} send a link to a message`
                            })
                        }
                        const id = message.author.id
                        const collector = botmsg.createMessageComponentCollector({
                            componentType: "BUTTON"
                        })
                        collector.on("collect", _ => {
                            if (_.user.id !== id) return _.deferUpdate()
                            w.deleteMessage(m)
                            botmsg.delete()
                            collector.stop()
                        })
                    })
                
            })
        }
}