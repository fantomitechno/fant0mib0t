import {Command, CommandHandler, BetterEmbed} from "advanced-command-handler"
import {Context} from '../../class/Context'

export default new Command(
	{
		name: "botinfo",
		description: "Get informations on the bot",
		aliases: ['stats', 'bi']
	},
	async (handler: typeof CommandHandler, ctx: Context) => { ctx.send('WIP') }
)
