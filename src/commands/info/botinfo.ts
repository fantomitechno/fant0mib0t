import { BetterEmbed, Command, CommandHandler } from 'advanced-command-handler';
import { Context } from '../../class/Context';
import { visuelTime } from '../../functions/string';


export default new Command(
	{
		name: 'botinfo',
		description: "Get informations about the bot",
		aliases: ['bi', "stats"],
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
		let embed = new BetterEmbed({
			color: "#af0303",
			author: {
				name: handler.client?.user?.tag,
				iconURL: handler.client?.user?.avatarURL() ?? undefined
			}
		})
		embed.fields.push({
			name: "⚙️ Developper(s) ➭",
			value: handler.owners.map(o => `- \`${handler.client?.users.cache.get(o)?.tag}\``).filter(f => f !== "- `undefined`").join('\n'),
			inline: true
		})
		embed.fields.push({
			name: "📑 • Information ➭",
			value: "- `Name` → " + handler.client?.user?.tag + "\n- `ID` → " + handler.client?.user?.id + "\n- `Uptime` → " + (await visuelTime(handler.client?.uptime ?? 0)),
			inline: true
		})
		embed.fields.push({
			name: "📈 • Stats ➭",
			value: "- `Guilds` →" + handler.client?.guilds.cache.size ?? 0 + "\n- `Members` →" + handler.client?.users.cache.size ?? 0 + " (`≈ " + ((handler.client?.users.cache.size ?? 0) / (handler.client?.guilds.cache.size ?? 1)).toFixed(0) + "/guild'`)\n- `Channels` →" + handler.client?.channels.cache.size ?? 0 + " (`≈ " + ((handler.client?.channels.cache.size ?? 0) / (handler.client?.guilds.cache.size ?? 1)).toFixed(0) + "/guild'`)\n- `Emojis` →" + handler.client?.emojis.cache.size ?? 0 + " (`≈ " + ((handler.client?.emojis.cache.size ?? 0) / (handler.client?.guilds.cache.size ?? 1)).toFixed(0) + "/guild'`)",
			inline: true
		})
		embed.fields.push({
			name: "⚙️ • Config ➭",
			value: "- `Platform` → " + process.platform + "\n - `Arch` → " + process.arch + "\n- `CPU` → " + ((process.cpuUsage().system / process.cpuUsage().user) * 100).toFixed(2) + "%",
			inline: true
		})

		ctx.send(embed)
	}
);