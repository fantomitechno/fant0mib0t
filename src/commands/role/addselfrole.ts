import { Command, CommandHandler, Tag } from 'advanced-command-handler';
import { MysqlError } from 'mysql';
import { Context } from '../../class/Context';
import { query } from '../../functions/db';
import { getRole } from '../../functions/get';
import { selfrole } from '../../type/Database';


export default new Command(
	{
		name: 'addselfrole', 
        aliases: ["asr"],
		description: "Add a self asignable role",
		clientPermissions: ['MANAGE_ROLES'],
		userPermissions: ['MANAGE_ROLES'],
		tags: [Tag.guildOnly]
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
		if (!ctx.args[0]) return ctx.send('You have to give a word that will be used as key word to give the role')
		query(`SELECT * FROM selfrole WHERE tag = "${ctx.args[0]}" AND guild ="${ctx.guild?.id}"`, async(err: MysqlError, res: selfrole[]) => {
			if (res.length) return ctx.send(`A role with this key word already exist in my database`)
			if (!ctx.args[1]) return ctx.send("You have to give a role to add")
			let role1 = await getRole(ctx.message, ctx.args.slice(1).join(' '))
			if (!role1) return ctx.send(`I can't find a role with the arg you sended`)
			query(`SELECT * FROM selfrole WHERE role = "${role1.id}" AND guild ="${ctx.guild?.id}"`, async(err: MysqlError, res: selfrole[]) => {
				if (res.length) return ctx.send(`This role is already in my database`)
				ctx.send(`Are you sure you want to link the role \`${role1}\` to the keyword \`${ctx.args[0]}\` and authorize your member`, {disableMentions: 'all'}).then(async(m) => {
					await m.react('✅')
					await m.react('❌')
					const col = m.createReactionCollector((reaction, user) => ['✅','❌'].includes(reaction.emoji.name) && user.id == ctx.author.id, {time: 30000})
					col.on("collect", (r, _) => {
						if (r.emoji.name === '✅') {
							query(`INSERT INTO selfrole (tag, role, guild) VALUES ("${ctx.args[0]}", "${role1?.id}", "${ctx.guild?.id}")`)
							m.delete()
							ctx.send('The selfrole have been created')
						} else {
							m.delete()
							ctx.send("The selfrole creation have been canceled")
						}
						col.stop()
					})
				})
			})
		})
	}
);