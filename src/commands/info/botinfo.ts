import { Command, CommandHandler } from 'advanced-command-handler';
import { Context } from '../../class/Context';


export default new Command(
	{
		name: 'botinfo',
		description: "Get informations about the bot",
		aliases: ['bi', "stats"],
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
		
	}
);