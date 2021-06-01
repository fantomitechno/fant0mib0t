import { BetterEmbed, Command, CommandHandler } from 'advanced-command-handler';
import { Message, NewsChannel, TextChannel } from 'discord.js';
import { Context } from '../../class/Context';
import { getChannel, getWebhook } from '../../functions/get';


export default new Command(
	{
		name: 'moveall',
		description: "Move a lot of messages from this channel to another",
        usage: "move <message 1> <message 2> <channel>",
        clientPermissions: ['MANAGE_MESSAGES', 'MANAGE_WEBHOOKS'],
        userPermissions: ['MANAGE_MESSAGES'],
        aliases: ["mva"],
        
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        if (!ctx.args[0]) return ctx.send('You have to indicate a message (link or id)')
        let messageLink_1, msg_1 = "none"
        if (ctx.args[0].replace(/discord.com/g,"discordapp.com").includes("discordapp.com/channels/")) {
            messageLink_1 = ctx.args[0].replace(/discord.com/g,"discordapp.com").split("discordapp.com/channels/")[1]
            let channel = messageLink_1.split("/")[1]
            msg_1 = messageLink_1.split("/")[2].slice(0,18)
            if (channel !== ctx.channel.id) return ctx.send('That\'s not in this channel')
        }
        if (!isNaN(Number(ctx.args[0]))) msg_1 = ctx.args[0]
        if (!(await ctx.channel.messages.fetch(msg_1))) return ctx.send('You have to indicate a message (link or id)')
        let message_1 = await ctx.channel.messages.fetch(msg_1)

        if (!ctx.args[1]) return ctx.send('You have to indicate a message (link or id)')
        let messageLink_2, msg_2 = "none"
        if (ctx.args[1].replace(/discord.com/g,"discordapp.com").includes("discordapp.com/channels/")) {
            messageLink_2 = ctx.args[1].replace(/discord.com/g,"discordapp.com").split("discordapp.com/channels/")[1]
            let channel = messageLink_2.split("/")[1]
            msg_2 = messageLink_2.split("/")[2].slice(0,18)
            if (channel !== ctx.channel.id) return ctx.send('That\'s not in this channel')
        }
        if (!isNaN(Number(ctx.args[1]))) msg_2 = ctx.args[1]
        if (!(await ctx.channel.messages.fetch(msg_2))) return ctx.send('You have to indicate a message (link or id)')
        let message_2: Message = await ctx.channel.messages.fetch(msg_2)

        if (Number(message_1.id) < Number(message_2.id)) return ctx.send("You have to send them in the order NEW | OLD")

        if (!ctx.args[2]) return ctx.send("You have to indicate a channel")
        let channel = getChannel(ctx.message, ctx.args[2])
        if (!channel?.isText) return ctx.send("This is not a text channel")
        if (!ctx.guild) return
        const w = await getWebhook(ctx.guild)
        if (!w) return
        await w.edit({channel: channel})

        await w.send(message_2.content, {
            embeds: message_2.embeds,
            files: message_2.attachments.map(a => a),
            username: message_2.member?.displayName,
            avatarURL: message_2.author.avatarURL() ?? undefined,
            split: true,
            disableMentions: "everyone"
        })
        message_2.delete()
        
        let messages = await ctx.channel.messages.fetch({after: message_2.id})
        let listmsg = messages.array().reverse()
        for (const message of listmsg) {
            await w.send(message.content, {
                embeds: message.embeds,
                files: message.attachments.map((a: any) => a),
                username: message.member?.displayName,
                avatarURL: message.author.avatarURL() ?? undefined,
                split: true,
                disableMentions: "everyone"
            })
            message.delete()
            if (message.id === message_1.id) {
                const embed = new BetterEmbed({
                    description: `A bunch of messages have been moved ${channel}`
                })
                ctx.send(embed)
                ctx.delete()
                break
            }
        }
	}
);