import { BetterEmbed, Command, CommandHandler } from 'advanced-command-handler';
import { Context } from '../../class/Context';


export default new Command(
	{
		name: 'info',
		description: "Informations to moderators",
        userPermissions: ['ADMINISTRATOR']
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
		const embed = new BetterEmbed({
            title: "Some information on moderation with me",
            description: "As you can see in the configuration there's no muted role or mod logs config, but they are here :\nTo have them you just have to create certains roles/channels : for the muted role create a role with \"mute\" in his name (for example, I use 'Orange Cat (muted)' on my server) and same for the mod logs you have to create a channel with \"logs-mod\" in his name"
        })
        ctx.send(embed)
	}
);