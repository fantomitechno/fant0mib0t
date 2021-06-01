import { Guild, Message, NewsChannel, Role, TextChannel, Webhook } from "discord.js";
const { findBestMatch } = require('string-similarity')

export const getRole = (message: Message, string: string) => {
    const cache = message?.guild?.roles?.cache
    if (cache?.has(string)) return cache.get(string)
    const result = getRoleFromMention(message, string)
    if (result) return result
    let roles: string[] = []
    let indexes: string[] = []
    cache?.forEach((role: Role) => {
        roles.push(role.name)
        indexes.push(role.id)
    })
    

    const match = findBestMatch(string, roles)

    if(match.bestMatch.rating > 0) {
        const displayName = match.bestMatch.target

        return cache?.get(indexes[roles.indexOf(displayName)])
    } return null

}


export const getRoleFromMention = (message: Message, mention: string) => {

    if (!mention) return

    if (mention.startsWith('<@&') && mention.endsWith('>')) {

        mention = mention.slice(3, -1)

        if (mention.startsWith('!')) {

            mention = mention.slice(1)

        }

        return message.guild?.roles.cache.get(mention)
    }
}

export const getUser = (message: Message, string: string) => {
    const cache = message.guild?.members.cache
    if (cache?.has(string)) return cache.get(string)

    const result = getUserFromMention(message, string)
    if (result) return result

    let members: string[] = []
    let indexes: string[] = []

    //for (const member of (cache as any)) {
    //    members.push(member.displayName)
    //    indexes.push(member.id)
    //    members.push(member.user?.username)
    //    indexes.push(member.id)
    //}
    cache?.forEach(member => {
        members.push(member.displayName)
        indexes.push(member.id)
        members.push(member.user.username)
        indexes.push(member.id)
    })

    const match = findBestMatch(string, members)
    if (match.bestMatch.rating > 0) {
        const displayName = match.bestMatch.target

        return cache?.get(indexes[members.indexOf(displayName)])
    } return null
}

export const getUserFromMention = (message: Message, mention: string) => {
    if (!mention) return

    if (mention.startsWith('<@') && mention.endsWith('>')) {

        mention = mention.slice(2, -1)
        if (mention.startsWith('!')) {

            mention = mention.slice(1)

        }

        return message.guild?.members.cache.get(mention)
    } else {
        return message.guild?.members.cache.get(mention)
    }
}

export const getChannel = (message: Message, string: string) => {
    const cache = message.guild?.channels.cache
    if (cache?.has(string)) return cache.get(string)

    if (string.startsWith('<#') && string.endsWith('>')) {
        string = string.slice(2, -1)

        if (string.startsWith('!')) {
            string = string.slice(1)
        }

        return message.guild?.channels.cache.get(string)
    }

    let channels: string[] = []
    let indexes: string[] = []

    cache?.forEach(channel => {
        channels.push(channel.name)
        indexes.push(channel.id)
    })
    
    const match = findBestMatch(string, channels)
    if (match.bestMatch.rating > 0) {
        const displayName = match.bestMatch.target

        return cache?.get(indexes[channels.indexOf(displayName)])
    } return null
}

export const getWebhook = async (guild: Guild) => {
    const w = await guild.fetchWebhooks()
    let webhook = w.map(w => w).filter(w => w.name === "fant0mib0t-webhook")
    if (!webhook.length) {
        await guild.systemChannel?.createWebhook("fant0mib0t-webhook", {
            avatar: guild.client?.user?.avatarURL() ?? undefined,
            reason: "Don't touch this !"
        }).then(w => {
            return w
        })
    } else {
        return webhook[0]
    }
}