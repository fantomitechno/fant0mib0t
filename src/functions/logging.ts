import { Message, NewsChannel, TextChannel } from "discord.js";
import { BetterEmbed } from "discord.js-better-embed/dist";


export const sendToModLogs = (message: Message, content: string, type: string) => {
    let logEmbed = new BetterEmbed({
        title: `New ${type}`,
        description: content
    })
    const channel: any = message.guild?.channels.cache.find(c => (c.name.includes("mod-logs") || c.name.includes("logs-mod")) && (c.type === "text" || c.type === "news"))
    channel?.send(logEmbed)
}