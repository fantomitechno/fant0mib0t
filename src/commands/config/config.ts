import { BetterEmbed, Command, CommandHandler } from 'advanced-command-handler';
import { Message } from 'discord.js';
import { MysqlError } from 'mysql';
import { Context } from '../../class/Context';
import { query } from '../../functions/db';
import { Config } from '../../type/Config';
import { SConfig } from '../../type/Database';


export default new Command(
	{
		name: 'config',
		description: "Get the server configuration",
        userPermissions: ["ADMINISTRATOR"],
		usage: "config [key] <value>"
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
		query(`SELECT config FROM config WHERE guild = "${ctx.guild?.id}"`, (err: MysqlError, res: SConfig[]) => {
			if (err) return console.error(err)
			if (!res.length) return ctx.send("An error occured...")
			const settings: Config = JSON.parse(res[0].config)
			let sets = settings as any
			let allSettings = Object.keys(settings).sort()
			if (!ctx.args[0]) {

				const embed = new BetterEmbed({
					title: "Configuration for " + ctx.guild?.name,
					description: `To see and edit a configuration use \`config [setting] <value>\` or \`config [category] [setting] <value>\`\n\n All possible configurable settings categories are : \`${allSettings.slice(1).join('\`, \`')}\``
				})

				return ctx.send(embed)

			}

			if (allSettings.includes(ctx.args[0])) {
				if (!ctx.args[1]) {
					let config = (settings as any)[ctx.args[0]]
					sendSettings(ctx.message, config, ctx.args[0], `To edit the configuration use \`config [key] <key 2> [value]\`\n\nExamples :\n\`config automod antilink false\` | Disable the anti invite link automod\n\n All possible configurable settings categories are : \`${allSettings.slice(1).join('\`, \`')}\``)
				} else {
					if (typeof sets[ctx.args[0]] === 'object' && sets !== null) {
						let value = Object.keys(sets[ctx.args[0]])
						
						if (value.includes(ctx.args[1])) {

							let newSettings: string|null = ctx.args[2]
							if (ctx.args[0] === "automod" && ["true", "false"].includes(newSettings?.toLowerCase())) return ctx.reply('The automoderations config can only be boolean')
							if (newSettings === 'null') newSettings = null

							sets[ctx.args[0]][ctx.args[1]] = newSettings
							query(`UPDATE FROM config WHERE guild = "${ctx.guild?.id}" SET config = "${JSON.stringify(sets)}"`)
							ctx.reply(`The config ${ctx.args[1]} of the category ${ctx.args[0]} has been changed to ${newSettings}`)
						}
					} else {
						
						let newSettings: string|null = ctx.args[1]
						if (newSettings === 'null') newSettings = null

						sets[ctx.args[0]] = newSettings
						query(`UPDATE FROM config WHERE guild = "${ctx.guild?.id}" SET config = "${JSON.stringify(sets)}"`)
						ctx.reply(`The config ${ctx.args[0]} has been changed to ${newSettings}`)
					}
				}
			}
		})
	}
);


function sendSettings(message: Message, settings: Config, category: string, desc: string) {


    let display = `= ${category} =\n`;
    if ((typeof settings === 'object') && (settings !== null)) {
        const keys = Object.keys(settings).sort();
        const longest = keys.reduce((long, str) => Math.max(long, str.length), 0);
        keys.forEach(key => {
            display += `${key}${" ".repeat(longest - key.length)} :: ${giveName((settings as any)[key], message)}\n`;
        });
    } else {
        display = `${category} :: ${settings}`
    }
    const embed = new BetterEmbed()
        .setTitle("Bot Settings")
        .setDescription(`${desc}\n\n \`\`\`asciidoc\n${display}\n\`\`\` `)
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp()
    message.channel.send(embed);


}


function giveName(text: string, message: Message) {
    const rolecache = message.guild?.roles.cache
    const channelcache = message.guild?.channels.cache

    if (text === null) return null
    const splitedText = text.toString().split(","),
    textTab = []
    for (let i = 0; i < splitedText.length; i++) {
        if (rolecache?.has(splitedText[i])) {
            textTab.push(`\n${rolecache.get(splitedText[i])?.name} (${splitedText[i]})`)
        } else if (channelcache?.has(splitedText[i])) {
            textTab.push(`\n${channelcache.get(splitedText[i])?.name} (${splitedText[i]})`)
        } else textTab.push(splitedText[i])
    }

    return textTab.join(", ")
}