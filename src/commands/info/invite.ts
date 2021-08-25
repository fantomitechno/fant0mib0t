import { BetterEmbed, Command, CommandHandler } from 'advanced-command-handler';
import { Context } from '../../utils/class/Context';


export default new Command(
	{
		name: 'invite',
        description: "Get the invite link and the support guild of the bot"
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        let embed = new BetterEmbed({
            title: handler.client?.user?.username + "➢ Invitation",
            description: "**__Invitation du bot__**\n<:Nothing:845679792204021800>⏣ Invitez "+handler.client?.user?.username+" sur votre serveur !\n<:Nothing:845679792204021800><:red_arrow:845680252251668480> [Inviter "+handler.client?.user?.username+" : Choisir vos permissions](https://discordapp.com/oauth2/authorize?client_id="+handler.client?.user?.id+"&scope=bot&permissions=-1)\n<:Nothing:845679792204021800><:red_arrow:845680252251668480> [Inviter "+handler.client?.user?.username+" : Permissions minimales](https://discordapp.com/oauth2/authorize?client_id="+handler.client?.user?.id+"&scope=bot&permissions=268758086)\n\n**__Serveur support__**\n<:Nothing:845679792204021800>⏣ Rejoignez le serveur Discord de "+handler.client?.user?.username+" !\n<:Nothing:845679792204021800><:red_arrow:845680252251668480> [Rejoindre le serveur de "+handler.client?.user?.username+"](http://discord.gg/x9BMZ6z)"
        })
        ctx.author.send(embed).catch(() => {
            ctx.send("Can't DM you :cry:")
        }).then(() => {
            if (ctx.guild) ctx.send("Look your dm")
        })
	}
);