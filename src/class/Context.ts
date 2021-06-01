import { Message, NewsChannel, TextChannel, Guild, EmojiIdentifierResolvable, MessageOptions, MessageAdditions, StringResolvable, APIMessage } from "discord.js";
import { CommandHandler, AdvancedClient, Command, Logger } from "advanced-command-handler"


export class Context {
    /**
     * The message the context refer to
     */
    public message: Message


    /**
     * The client
     */
    public client: AdvancedClient | null

    /**
     * The prefixes
     */
    public prefix: string

    /**
     * The args
     */
     public args: string[]
     
    /**
     * The command
     */
     public command: Command

     /**
      * The handler
      */
      public handler: typeof CommandHandler


    public constructor(handler: typeof CommandHandler ,message: Message, prefix: string, args: string[], command: Command) {
        this.message = message
        this.handler = handler
        this.client = handler.client
        this.prefix = prefix,
        this.args = args,
        this.command = command
    }

    /**
     * @returns TextChannel | null | NewsChannel
     */
    public get channel () {
        return this.message.channel
    }

    /**
     * @returns Guild | null
     */
    public get guild () {
        return this.message.guild
    }

    /**
     * @returns User
     */
    public get author () {
        return this.message.author
    }

    /**
     * @returns GuildMember | null
     */
    public get member () {
        return this.message?.member
    }

    /**
     * @returns GuildMember | null
     */
    public get me () {
        return this.guild?.me
    }

    public send = (content: any) => {
        return this.channel.send(content)
    }

    public reply = (content: any) => {
        return this.message.reply(content)
    }
    
    public delete = () => {
        if (this.message.deletable) {
            return this.message.delete()
        } else {
            return Logger.info("Tried to delete a non deletable message trough the ctx.delete()", "context")
        }
    }

    public bulkDelete = (n: number) => {
        return (this.channel as TextChannel|NewsChannel).bulkDelete(n)
    }

    public react = (emoji: EmojiIdentifierResolvable) => {
        return this.message.react(emoji)
    }

    public reacts = async (emojis: EmojiIdentifierResolvable[]) => {
        for (const emoji of emojis) {
            await this.react(emoji)
        }
    }
}