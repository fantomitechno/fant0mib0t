export type Config = {
    automod: {
        antilink: boolean,
        uppercase: boolean,
        spam: boolean,
        dupplicated: boolean
    },
    antilinkBypass: string|null,
    linkPreview: boolean,
    dynamicVoiceBase: string|null
}