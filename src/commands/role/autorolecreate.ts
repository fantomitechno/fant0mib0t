import { Command, CommandHandler, BetterEmbed, Tag } from 'advanced-command-handler'
import { GuildChannel } from 'discord.js';
import { Context } from '../../utils/class/Context'
import { query } from '../../utils/functions/db';


export default new Command(
	{
		name: 'autorolecreate',
		description: 'Create a tiny thing that your members can have\nThis command will create a message if your looking to work with a already existing message go for `autoroleregister` (or `arr`)',
		aliases: ['arc'],
		tags: [Tag.guildOnly],
		cooldown: 5,
        usage: 'autorolecreate',
        clientPermissions: ['MANAGE_ROLES', 'ADD_REACTIONS'],
        userPermissions: ['MANAGE_ROLES']
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        let idChannel: any;
        let idMessage: any;
        let channel: GuildChannel | undefined;
        let messageAutoRole: any;
        let etape = 0;
        let autoRoleList: any = {};
        let embed = new BetterEmbed({
            title: "Creating a role reaction",
            footer: {
                text: "To cancel the creation just send \"stop\""
            },
            hexColor: "#af0303"
        })
        const etapeList = [
            "Enter the channel were the role reaction will take place",
            "Enter the message of the role reaction panel\nTip: Don't forget to put `{roles}` to add the role list",
            "Enter the roles (one by one) by following the format `@role :emoji;`, when you're done send `end`"
        ];
        embed.description = etapeList[etape]
        ctx.send(embed)
        let collector = ctx.channel.createMessageCollector(
          (m) => m.author.id === ctx.author.id
        );
        collector.on("collect", async (msg) => {
          if (!msg) return;
          if (msg.content.toLowerCase() === "stop") return collector.stop();
          if (etape === 0) {
            idChannel = msg.content.replace(/[^0-9]/g, "");
            if (!ctx.guild?.channels.cache.has(idChannel)) return msg.channel.send("Salon introuvable !");
    
            channel = ctx.guild.channels.cache.get(idChannel);
            if (!channel?.isText) return msg.channel.send("Le salon n'est pas un salon textuel.");
            
            etape++;
            embed.description = etapeList[etape]
            ctx.send(embed)
          } else if (etape === 1) {
            messageAutoRole = msg.content;
            idMessage = await (channel as any).send(messageAutoRole);
            etape++;
            embed.description = etapeList[etape]
            ctx.send(embed)
          } else {
            if (msg.content.toLowerCase() === "end") {
                if (Object.entries(autoRoleList).length == 0) return msg.channel.send("If you want to cancel your current creation send `stop`");
                query(`INSERT INTO autorole (server_id, message_id, channel_id, role) VALUES ("${ctx.guild?.id}", "${idMessage.id}", "${idChannel}", '${JSON.stringify(autoRoleList)}')`)
                msg.channel.send("Autorole created!");
              collector.stop();
            } else {
              let args = msg.content.split(" ");
              let idRole = args[0].replace(/[^0-9]/g, "");
              if (!ctx.guild?.roles.cache.has(idRole)) return msg.channel.send("Can't find the role!");
              idMessage.react(args[1]).catch((err: any) => msg.channel.send("Can't find the emoji!")).then(async (m: any) => {
                let emoji = args[1]
                if (emoji.length > 10) emoji = emoji.split(":")[2].replace(">","")
                autoRoleList[emoji] = idRole
                let messageLook: any = Object.entries(autoRoleList)
                messageLook = messageLook.map((r: any) => (r[0].length > 10 ? String(handler.client?.emojis.cache.get(r[0])) : r[0]) +" - "+"<@&"+idRole+">").join("\n")
                idMessage.edit(messageAutoRole.replace("{roles}", messageLook))
                msg.channel.send("Role added!")
              })
            }
          }
        });
    }
)