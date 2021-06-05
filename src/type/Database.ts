import { Blob } from "node-fetch"

export type SConfig = {
    config: string,
    guild: string
}

export type autorole = {
    message_id: string,
    channel_id: string,
    server_id: string,
    role: Blob
}

export type casier = {
    id: string,
    guilds: string,
    type: string,
    reasons: Blob,
    mods: string
}

export type mute = {
    id: string,
    guild: string
}

export type selfrole = {
    tag: string,
    role: string,
    guild: string
}

export type temp = {
    id: string,
    guild: string,
    type: string,
    time: number,
    date: number
}

export type rss = {
    guild: string,
    channel: string,
    flux: string,
    type: string,
    lastCheck: number,
    message: Blob
}