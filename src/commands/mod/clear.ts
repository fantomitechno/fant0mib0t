import { Command, CommandHandler, BetterEmbed, Tag } from 'advanced-command-handler'
import { Context } from '../../class/Context'
import { sendToModLogs } from '../../functions/logging'


export default new Command(
	{
		name: 'clear',
		description: 'Hop this never existed',
		aliases: ['c'],
		tags: [Tag.guildOnly],
		cooldown: 5,
        usage: 'clear [number]',
        clientPermissions: ['MANAGE_MESSAGES'],
        userPermissions: ['MANAGE_MESSAGES']
	},
	async (handler: typeof CommandHandler, ctx: Context) => {
        if (!ctx.args[0] || isNaN(Number(ctx.args[0]))) return ctx.send("You have to provide a number")
        const number = Number(ctx.args[0])
        if (number < 0) return ctx.send("Really ?")
        ctx.delete()
        ctx.bulkDelete((number)).then(() =>{
            ctx.send("You deleted "+ number + "messages.")
        }).catch(async () => {
            const numberDelete = number/100
            await del(Math.floor(numberDelete), ctx.message.id, ctx, number > 100 ? 100 : number, number, number)
        })
    }
)

const del = async(number: any, id: any, ctx: Context, number2: any, numberDelete: any, total: any) => {
    await ctx.channel.messages.fetch({ limit: number2, before: id}).then(async msg => {
      let messages = msg.map(r => r)
      let newId = id
      for (let i = 0; i < messages.length; i++) {
          if(messages[i]) {
            if (i < (messages.length-1)) await messages[i].delete().catch(_ => total--)
            newId = messages[i].id
        }
      }
      if (number === 0) {
          ctx.send("You deleted "+ total + "messages.")
        } else {
          number--
          numberDelete -= 100
          await del(Math.floor(number), newId, ctx, numberDelete > 100 ? 100 : numberDelete, numberDelete, total)
      }
    })
  }