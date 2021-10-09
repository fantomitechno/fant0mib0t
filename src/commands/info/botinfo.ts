import {CommandInteraction, MessageEmbed} from 'discord.js';
import {Command, Bot} from '../../utils/class';
import { visuelTime } from "../../utils/functions"

export default new Command(
	{
		name: 'botinfo',
		description: 'Get informations about the bot',
	},
	async (client: Bot, interaction: CommandInteraction) => {
		let embed = new MessageEmbed({
			color: "#af0303",
			author: {
				name: client.user?.tag,
				iconURL: client.user?.avatarURL() ?? undefined
			}
		})
		embed.fields.push({
			name: "⚙️ Developper(s) ➭",
			value: client.developpers.map(o => `- \`${client.users.cache.get(o)?.tag}\``).filter(f => f !== "- `undefined`").join('\n'),
			inline: true
		})
		embed.fields.push({
			name: "📑 • Information ➭",
			value: "- `Name` → " + client.user?.tag + "\n- `ID` → " + client.user?.id + "\n- `Uptime` → " + (await visuelTime(client.uptime ?? 0)),
			inline: true
		})
		embed.fields.push({
			name: "📈 • Stats ➭",
			value: "- `Guilds` →" + client.guilds.cache.size ?? 0 + "\n- `Members` →" + client.users.cache.size ?? 0 + " (`≈ " + ((client.users.cache.size ?? 0) / (client.guilds.cache.size ?? 1)).toFixed(0) + "/guild'`)\n- `Channels` →" + client.channels.cache.size ?? 0 + " (`≈ " + ((client.channels.cache.size ?? 0) / (client.guilds.cache.size ?? 1)).toFixed(0) + "/guild'`)\n- `Emojis` →" + client.emojis.cache.size ?? 0 + " (`≈ " + ((client.emojis.cache.size ?? 0) / (client.guilds.cache.size ?? 1)).toFixed(0) + "/guild'`)",
			inline: true
		})
		embed.fields.push({
			name: "⚙️ • Config ➭",
			value: "- `Platform` → " + process.platform + "\n - `Arch` → " + process.arch + "\n- `CPU` → " + ((process.cpuUsage().system / process.cpuUsage().user) * 100).toFixed(2) + "%",
			inline: true
		})
        interaction.reply({
            embeds: [embed]
        })
	}
);
