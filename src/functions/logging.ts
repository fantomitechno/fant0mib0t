import { Guild } from "discord.js";
import { BetterEmbed } from "discord.js-better-embed/dist";


export const sendToModLogs = (guild: Guild | null, content: string, type: string) => {
    let logEmbed = new BetterEmbed({
        title: `New ${type}`,
        description: content,
        hexColor: "#3498db"
    })
    const channel: any = guild?.channels.cache.find(c => (c.name.includes("mod-logs") || c.name.includes("logs-mod")) && (c.type === "text" || c.type === "news"))
    channel?.send(logEmbed)
}