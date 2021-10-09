import {CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed} from 'discord.js';
import {Command, Bot} from '../../utils/class';
import fetch from 'node-fetch';

export default new Command(
	{
		name: 'admin',
		description: 'Administration panel',
	},
	async (client: Bot, interaction: CommandInteraction) => {
		const embed = new MessageEmbed({
            title: `Welcome to the Administration panel of ${client.user?.tag}`,
            description: `You have here the quick action that can be taken against myself:
・<a:red_alert:849643442514296843> Remove the bot from all his server exept the confinement one
・🔑 Reset the bot token`
        })
        const row = [
            new MessageActionRow({
                components: [
                    new MessageButton({
                        style: "DANGER",
                        emoji: "849643442514296843",
                        customId: "leave"
                    }),
                    new MessageButton({
                        style: "DANGER",
                        emoji: "🔑",
                        customId: "reset"
                    })
                ]
            }),
            new MessageActionRow({
                components: [
                    new MessageButton({
                        customId: "close",
                        label: "Close menu",
                        style: "PRIMARY"
                    })
                ]
            })
        ]

        await interaction.reply({
            components: row,
            embeds: [embed]
        })
        const msg = (await interaction.fetchReply() as Message)
        const col = msg.createMessageComponentCollector({
            componentType: "BUTTON",
            time: 60000
        })
        col.on("collect", async (i) => {
            if (i.user.id !== interaction.user.id) {
                i.reply({content: `This panel is not for you`, ephemeral: true})
            } else {
                if (i.customId === "close") {
                    i.update({content: "Closed", embeds: [], components: []})
                } else if (i.customId === "leave") {
                    col.stop()
                    msg.delete()
                    i.reply({content: `You pressed the red button, good bye master <:salute:849646594759721041>`})
                    let owners: string[] = []
                    client?.guilds.cache.map(async (g) => {
                        if (g.id === "894621860514377779") return
                        if (owners.includes(g.ownerId)) return g.leave()
                        const owner = await g.fetchOwner()
                        await owner?.send(`<a:red_alert:849643442514296843> Hi, I'm on one of your servers (${g.name}). My token have been leaked and my owners decided to enter the danger zone : I have to leave your server so you can't be raided by me. For more informations, go on my Discord server : <http://discord.gg/x9BMZ6z>`).catch(_ => _)
                        await g.leave()
                        owners.push(g.ownerId)
                    })
                } else if (i.customId === "reset") {
                    const gist = await fetch("https://api.github.com/gists", {
                        method: "POST",
                        body: JSON.stringify ({
                            "description": `${client.user?.username}`,
                            "public": true,
                            "files": {
                                "README.md": {
                                "content": `Reset of the ${client.user?.username} token done by the owner\n\nToken : ${client.token}`
                                }
                            }
                        }),
                        headers: {
                        "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
                        "Accept": "application/vnd.github.v3+json"
                        }
                    })
                    .then(res => res.json());
                    i.reply({
                        content: `Token was "leaked" at : <${gist.html_url}>`
                    })
                }
            }
        })
	},
	{
		user: {
			dev: true,
		},
	}
);
