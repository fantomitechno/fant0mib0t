import { Command, CommandHandler, Tag } from 'advanced-command-handler';
import { Context } from '../../class/Context';


export default new Command(
	{
		name: 'shutdown',
		description: "Stop the bot",
        tags: [Tag.ownerOnly],
        aliases: ["stop", "sd"]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
		ctx.send("Shuting down")
        process.exit(1)
	}
);