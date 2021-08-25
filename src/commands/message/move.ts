import { BetterEmbed, Command, CommandHandler } from 'advanced-command-handler';
import { Message, NewsChannel, TextChannel } from 'discord.js';
import { Context } from '../../utils/class/Context';
import { getChannel, getWebhook } from '../../utils/functions/get';


export default new Command(
	{
		name: 'move',
		description: "Move message from this channel to another",
        usage: "move <message> <channel>",
        clientPermissions: ['MANAGE_MESSAGES', 'MANAGE_WEBHOOKS'],
        userPermissions: ['MANAGE_MESSAGES'],
        aliases: ["mv"]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        if (!ctx.args[0]) return ctx.send('You have to indicate a message (link or id)')
        let messageLink, msg = "none"
        if (ctx.args[0].replace(/discord.com/g,"discordapp.com").includes("discordapp.com/channels/")) {
            messageLink = ctx.args[0].replace(/discord.com/g,"discordapp.com").split("discordapp.com/channels/")[1]
            let channel = messageLink.split("/")[1]
            msg = messageLink.split("/")[2].slice(0,18)
            if (channel !== ctx.channel.id) return ctx.send('That\'s not in this channel')
        }
        if (!isNaN(Number(ctx.args[0]))) msg = ctx.args[0]
        if (!(await ctx.channel.messages.fetch(msg))) return ctx.send('You have to indicate a message (link or id)')
        let message: Message
        if (msg === "none") {
            message = await ctx.channel.messages.fetch(ctx.args[0])
        } else {
            message = await ctx.channel.messages.fetch(msg)
        }
        if (!ctx.args[1]) return ctx.send("You have to indicate a channel")
        let channel = getChannel(ctx.message, ctx.args[1])
        if (!channel?.isText) return ctx.send("This is not a text channel")
        if (!ctx.guild) return
        const w = await getWebhook(ctx.guild)
        if (!w) return
        await w.edit({channel: channel})
        await w.send(message.content, {
            embeds: message.embeds,
            files: message.attachments.map(a => a),
            username: message.member?.displayName,
            avatarURL: message.author.avatarURL() ?? undefined,
            split: true
        }).then(async _ => {
            message.delete()
            const embed = new BetterEmbed({
                description: `One message from ${message.member?.displayName} have been moved to ${channel}`
            })
            ctx.send((message.member?.toString(), embed))
            ctx.delete()
        })
	}
);