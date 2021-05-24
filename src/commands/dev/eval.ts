import { Command, CommandHandler, getThing, BetterEmbed, Tag } from 'advanced-command-handler'
import { transpile } from 'typescript'
import { Context } from '../../class/Context'
import util from "util"


export default new Command(
	{
		name: 'eval',
		description: 'Evaluate some code',
		aliases: ['e'],
		tags: [Tag.ownerOnly],
        usage: 'eval [code]'
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
		try {
            const code = ctx.args.join(' ')
            const result = transpile(code)
            const ev: any = eval(result)
            let str = util.inspect(ev, {
                depth: 1
            })
            str = `${str.replace(new RegExp(`${handler.client?.token}`, "g"), "")}`
            if (str.length > 1800) {
                for (let i = 0; i < str.length; i = i + 1800) {
                    let ss = str.substr(i, (i + 1800))
                    const embed = new BetterEmbed({
                        color: "GREEN",
                        author: {
                            name: ctx.author.tag, 
                            iconURL: ctx.author.displayAvatarURL()
                        },
                        footer: {
                            text: handler.client?.user?.username + " • Page (" + Math.floor(i / 1800) + "/" + (Math.ceil(str.length / 1800) - 1) + ") ",
                            iconURL: ctx.client?.user?.displayAvatarURL()
                        },
                        description: "\`\`\`js\n" + ss.substr(0, 1800) + "\`\`\`"
                    })
                    ctx.send(embed)
                }
            } else {
                str = str.substr(0, 1800)
                if (str === "undefined") str = "No output"
                const embed = new BetterEmbed({
                    color: "GREEN",
                    author: {
                        name: ctx.author.tag, 
                        iconURL: ctx.author.displayAvatarURL()
                    },
                    footer: {
                        text: handler.client?.user?.username + " • Page (1/1) ",
                        iconURL: ctx.client?.user?.displayAvatarURL()
                    },
                    description: "\`\`\`js\n" + str + "\`\`\`"
                })
                ctx.send(embed)
            }
        } catch (err) {
            const embed = new BetterEmbed({
                color: "RED",
                author: {
                    name: ctx.author.tag, 
                    iconURL: ctx.author.displayAvatarURL()
                },
                footer: {
                    text: handler.client?.user?.username + " • Page (1/1) ",
                    iconURL: ctx.client?.user?.displayAvatarURL()
                },
                description: "\`\`\`js\n" + err + "\`\`\`"
            })
            ctx.send(embed)
        }
	}
)