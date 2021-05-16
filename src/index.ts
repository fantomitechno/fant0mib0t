import { CommandHandler } from 'advanced-command-handler'
import config from './config.json'

process.chdir('out')

CommandHandler.create({
    prefixes: [config.prefix],
    commandsDir: 'commands',
    eventsDir: 'events'
})
.setDefaultCommands()
.setDefaultEvents()

CommandHandler.launch({
    token: config.token,
    clientOptions: {
        ws: { 
            intents: [
                "GUILDS",
                "GUILD_MEMBERS",
                "GUILD_BANS",
                "GUILD_EMOJIS",
                "GUILD_INTEGRATIONS",
                "GUILD_WEBHOOKS",
                "GUILD_INVITES",
                "GUILD_VOICE_STATES",
                "GUILD_PRESENCES",
                "GUILD_MESSAGES",
                "GUILD_MESSAGE_REACTIONS",
                "GUILD_MESSAGE_TYPING",
                "DIRECT_MESSAGES",
                "DIRECT_MESSAGE_REACTIONS",
                "DIRECT_MESSAGE_TYPING"
            ] 
        },
        restTimeOffset: 0,
        disableMentions: 'everyone',
        messageCacheMaxSize: 100
    }
})