import { CommandHandler, Event, Logger } from 'advanced-command-handler'
import { GuildMember } from 'discord.js'
import { MysqlError } from 'mysql'
import { query } from '../functions/db'

export default new Event(
    {
        name: 'guildMemberAdd'
    },

    async (handler: typeof CommandHandler, member: GuildMember): Promise<any> => {
        query(`SELECT * FROM mute WHERE id = "${member.id}" AND guild = "${member.guild?.id}"`, (err: MysqlError|null, res: any) => {
			if (err) return console.log(err)
			if (res.length) {
                if (!member.guild.me?.hasPermission('MANAGE_ROLES')) return
				let mutedRole = member.guild.roles.cache.find(r => r.name.includes('mute') && !r.managed)?.id ?? "0"
                member.roles.add(mutedRole)
			}
		})
    }
)