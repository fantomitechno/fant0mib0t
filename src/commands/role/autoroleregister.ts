import { Command, CommandHandler, BetterEmbed, Tag } from 'advanced-command-handler'
import { NewsChannel, TextChannel } from 'discord.js';
import { MysqlError } from 'mysql';
import { Context } from '../../class/Context'
import { query } from '../../functions/db';
import { autorole } from '../../type/Database';


export default new Command(
	{
		name: 'autoroleregister',
		description: 'Create a tiny thing that your members can have\nThis command will use an existing message if your looking to create a message go for `autorolecreate` (or `arc`)',
		aliases: ['arr'],
		tags: [Tag.guildOnly],
		cooldown: 5,
        usage: 'autoroleregister',
        clientPermissions: ['MANAGE_ROLES', 'ADD_REACTIONS'],
        userPermissions: ['MANAGE_ROLES']
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        let idChannel: any;
        let idMessage: any;
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
            "Enter the link to the message",
            "Enter the roles (one by one) by following the format `@role :emoji;`, when you're done send `end`"
        ];
        embed.description = etapeList[etape]
        ctx.send(embed)
        let collector = ctx.channel.createMessageCollector(
          (m) => m.author.id === ctx.author.id
        );
        collector.on("collect", async (msg) => {
          if (!msg) return;
          if (msg.content.toLowerCase() === "stop") return collector.stop(), ctx.send("Creation stoped")
          if (etape === 0) {
            if (msg.content.replace(/discord.com/g,"discordapp.com").includes("discordapp.com/channels/")) {
                const messageLink = msg.content.replace(/discord.com/g,"discordapp.com").split("discordapp.com/channels/")[1]
                const server = messageLink.split("/")[0]
                const channel = messageLink.split("/")[1]
                const msg1 = messageLink.split("/")[2].slice(0,18)
                if (server !== ctx.guild?.id) return ctx.send('The message you sended is not on this server')
                const getMsg = await (ctx.guild?.channels.cache.get(channel) as TextChannel|NewsChannel)?.messages.fetch(msg1)
                if (!getMsg) return ctx.send("The message you sended is not available or I can't see it")
                idMessage = getMsg
                query(`SELECT * FROM autorole WHERE message_id = "${idMessage.id}"`, (err: MysqlError, res: autorole[]) => {
                    if (res.length) return ctx.send('This message is already an autorole')
                    idChannel = channel
                    etape ++
                    embed.description = etapeList[etape]
                    ctx.send(embed)
                })
            } else {
                ctx.send("Please send a message link")
            }
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
                msg.channel.send("Role added!")
              })
            }
          }
        })
    }
)