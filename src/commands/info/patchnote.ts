import { BetterEmbed, Command, CommandHandler } from 'advanced-command-handler';
import { Context } from '../../utils/class/Context';
require('../../utils/JSON/patchnote.json')

type patchnote = {
    latest: {
        name: string,
        id: string,
        description: string,
        features: string[]
    },
    releases: {
        name: string,
        id: string,
        description: string,
        features: string[]
    }[]
}

export default new Command(
	{
		name: 'patchnote',
		description: "Get the bot patchnote",
        usage: "patchnote [version]\npatchnote list",
        aliases: ["pn","patch", "versions"]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        let patchnote: patchnote = require('../../utils/JSON/patchnote.json')
        let versions = patchnote.releases.map(m => m.id)
		if (ctx.args[0] === "list") {
            const embed = new BetterEmbed({
                title: "Bot versions list:",
                description: `${handler.client?.user?.username} has ${patchnote.releases.length} versions\n\nList of them:\n - ${patchnote.releases.map(r => `**${r.name}** | \`${r.id}\``).join('\n - ')}`,
                footer: {
                    text: `You can have information on a secific version by using "patchnote <version_id>"`
                }
            })
            ctx.send(embed)
        } else if (versions.includes(ctx.args[0])) {
            let index = versions.indexOf(ctx.args[0])
            const embed = new BetterEmbed({
                title: `Information on version ${patchnote.releases[index]}`,
                description: `Name: \`${patchnote.releases[index].name}\`\nId: \`${patchnote.releases[index].id}\n\n*${patchnote.releases[index].description}*\nNew features:\n\`${patchnote.releases[index].features.length ? patchnote.releases[index].features.join('\`, \`') : "None"}\``
            })
            ctx.send(embed)
        } else {
            const embed = new BetterEmbed({
                title: "Latest bot version:",
                description: `Name: \`${patchnote.latest.name}\`\nId: \`${patchnote.latest.id}\`\n\n*${patchnote.latest.description}*\nNew features:\n\`${patchnote.latest.features.length ? patchnote.latest.features.join('\`, \`') : "None"}\``,
                footer: {
                    text: "To have the list of all the version use \"patchnote list\""
                }
            })
            ctx.send(embed)
        }
	}
);