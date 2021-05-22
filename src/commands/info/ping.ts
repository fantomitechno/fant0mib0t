import { Command, CommandHandler } from 'advanced-command-handler';
import { Context } from '../../class/Context';


export default new Command(
	{
		name: 'ping',
		description: "Get the bot latency"
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
		const botPing = handler.client?.ws.ping
		const apiPing = Date.now() - ctx.message.createdTimestamp
		ctx.send(`Bot Latency: **${botPing}**ms\nAPI Latency: **${apiPing}**ms`);
	}
);