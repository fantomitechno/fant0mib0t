import {Message, MessageEmbed, NewsChannel, TextChannel} from 'discord.js';
import { Event, CommandHandler, getThing, permissionsError, Tag, Logger, argError, codeError} from 'advanced-command-handler'
import {Context} from "../class/Context"

export default new Event(
	{
		name: 'message',
	},
	async (handler: typeof CommandHandler, message: Message): Promise<any> => {
		if (message.author.bot || message.system) return;

		handler.client?.emit("automod", (message))
		if (message.content.replace(/discord.com/g,"discordapp.com").includes("discordapp.com/channels/")) {
            let messageLink = message.content.replace(/discord.com/g,"discordapp.com").split("discordapp.com/channels/")[1]
            let server = messageLink.split("/")[0]
            let channel = messageLink.split("/")[1]
            let msg = messageLink.split("/")[2].slice(0,18)
                if (handler.client?.channels.cache.get(channel)) {
                    (handler.client?.channels.cache.get(channel) as TextChannel|NewsChannel)?.messages.fetch(msg).then(async m => {
                        //message.channel.createWebhook((message.guild.members.cache.get(message.author.id).nickname === null ? message.author.username : message.guild.members.cache.get(message.author.id).nickname), {
                            //avatar: message.author.displayAvatarURL({ format: 'png' }),
                        //})
                        //.then(webhook => {
                            //let wh = new Discord.WebhookClient(webhook.id, webhook.token);
                            let embed
                            let replace = "https://discordapp.com/channels/"+server+"/"+channel+"/"+msg
                            if (m.embeds.length === 0) {
                            embed = new MessageEmbed()
                            .setColor("RED")
                            .setAuthor(m.author.tag, m.author.displayAvatarURL({ format: 'png' }))
                            .setDescription(m.content)
                            .addField("_ _","[Jump]("+replace+")")
                            .setFooter(m.author.id)
                            .setTimestamp(m.createdTimestamp)
                        } else {
                            embed = new MessageEmbed()
                            if (m.embeds[0].title !== null) embed.setTitle(m.embeds[0].title)
                            if (m.embeds[0].description !== null) embed.setDescription(m.embeds[0].description)
                            if (m.embeds[0].color !== null) embed.setColor(m.embeds[0].color)
                            if (m.embeds[0].timestamp !== null) embed.setTimestamp(m.embeds[0].timestamp)
                            if (m.embeds[0].image !== null) embed.setImage(m.embeds[0].image.url)
                            if (m.embeds[0].author !== null) {
                                if (m.embeds[0].author.iconURL == undefined) {
                                    embed.setAuthor(m.embeds[0].author.name)
                                } else embed.setAuthor(m.embeds[0].author.name,m.embeds[0].author.iconURL)
                            }
                            if (m.embeds[0].footer !== null) {
                                if (m.embeds[0].footer.iconURL == undefined) {
                                    embed.setFooter(m.embeds[0].footer.text)
                                } else embed.setFooter(m.embeds[0].footer.text,m.embeds[0].footer.iconURL)
                            }
                            if (m.embeds[0].fields !== null) {
                                embed.addFields(m.embeds[0].fields)
                            }
                        }
                            message.channel.send(embed).then(async (m) => {
								await m.react('🗑️')
								const id = message.author.id
								const collector = m.createReactionCollector((reaction, user) => reaction.emoji.name === "🗑️" && user.id == id, {time: 600000})
								collector.on("collect", (r, u) => {
									m.delete()
									collector.stop()
								})
								collector.on("end", (_, r) => {
									if (r === "time") m.reactions.removeAll()
								})
							})
                        
                    })
                }
        }
		const prefix = CommandHandler.getPrefixFromMessage(message);
		if (!prefix) return;

		const [commandArg, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = await getThing('command', commandArg.toLowerCase().normalize());

		if (command) {
			if (command.isInCooldown(message)) return message.channel.send(`You are on a cooldown! Please wait **${command.getCooldown(message).waitMore / 1000}**s.`);

			if (!command.isInRightChannel(message)) return message.channel.send(`This command is not in the correct channel.`);

			const missingPermissions = command.getMissingPermissions(message);
			const missingTags = command.getMissingTags(message);

			if (missingPermissions.client.length) return permissionsError(message, missingPermissions.client, command, true);
			if (missingPermissions.user.length) return permissionsError(message, missingPermissions.user, command);

			if (missingTags.length)
				return argError(
					message,
					`There are missing tags for the message: \n\`${missingTags
						.map(tag => Tag[tag])
						.sort()
						.join('\n')
						.toUpperCase()}\``,
					command
				);
			try {
                let ctx = new Context(handler, message, prefix, args, command)
				await command.run(handler, ctx);
				command.setCooldown(message);
				Logger.log(`${message.author.tag} has executed the command ${Logger.setColor('red', command.name)}.`);
			} catch (error) {
				await codeError(message, error, command);
			}
		}
	}
);