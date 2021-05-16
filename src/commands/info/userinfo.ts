import {Command, CommandHandler, Tag} from 'advanced-command-handler'
import {GuildMember, Message, MessageAttachment, MessageEmbed} from 'discord.js'
import { getUser } from '../../functions/get'
import {  } from '../../functions/canvas'
import moment from 'moment'
import Canvas from 'canvas'

const status = {
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline/Invisible",
    invisible: "Offline/Invisible"
}

export default new Command(
	{
		name: 'userinfo',
		description: 'Get informations on you',
		aliases: ['ui','info'],
		tags: [Tag.guildOnly],
		cooldown: 5
	},
	async (handler: typeof CommandHandler, message: Message) => {
        const member: any = (message.content.split(' ')[0]) ? message.member : getUser(message, message.content.split(' ')[0])
        if (member === null) return message.channel.send("Error cannot find a match!")

        const activity = member?.user.presence.activities[0]

        const canvas = activity ? (activity.type === "LISTENING" || activity.type === "PLAYING") ? Canvas.createCanvas(800, 800) : activity.type === "STREAMING" ? Canvas.createCanvas(800, 825) : activity.type === "CUSTOM_STATUS" ? Canvas.createCanvas(800, 650) : Canvas.createCanvas(800, 550) : Canvas.createCanvas(800, 550)

        const ctx = canvas.getContext('2d')

        const sortedMembers: any = message.guild?.members?.cache.array().sort((a: any, b: any) => a.joinedTimestamp - b.joinedTimestamp )

        const position: any = sortedMembers?.indexOf(member) + 1

        ctx.fillStyle = '#2C2F33'
        ctx.fillRect(0, 178, canvas.width, canvas.height)

        
	}
);
/*
const { textLimiter , drawEmoji, getImgCache, drawCircle, rectRounded} = require('../../modules/functions/global')
const twemoji = require('twemoji');

  ctx.fillStyle = '#2C2F33'
  ctx.fillRect(0, 178, canvas.width, canvas.height)

  ctx.fillStyle = '#23272A'
  ctx.fillRect(0, 0, canvas.width, 178)

  ctx.save()
  drawCircle(89, 89, 64, ctx)
  ctx.clip()

  const avatar = await getImgCache(member.user.displayAvatarURL({ format: "png" })) 
  ctx.drawImage(avatar, 25, 25, 128, 128)
  ctx.restore()
  drawCircle(140, 140, 30, ctx)
  if (member.user.presence.status === 'online') {
    ctx.fillStyle = "#43b581"
    drawCircle(140, 140, 20, ctx)
  } else if (member.user.presence.status === "idle") {
    ctx.fillStyle = "#faa61a"
    drawCircle(140, 140, 20, ctx)
    ctx.fillStyle = '#23272A'
    drawCircle(130, 130, 16, ctx)
  } else if (member.user.presence.status === "dnd") {
    ctx.fillStyle = "#f04747"
    drawCircle(140, 140, 20, ctx)
    ctx.fillStyle = '#23272A'
    ctx.fillRect(125, 137, 30, 8)
    drawCircle(125, 141, 4, ctx)
    drawCircle(155, 141, 4, ctx)
  } else if (member.user.presence.status === "offline" || member.user.presence.status === "invisible") {
    ctx.fillStyle = "#727d8a"
    drawCircle(140, 140, 20, ctx)
    ctx.fillStyle = '#23272A'
    drawCircle(140, 140, 9, ctx)
  }

  memberTag = member.user.tag.split("#")
  ctx.font = '50px Whitney Medium'
  ctx.fillStyle = "white"
  if(member.nickname) {
    await drawEmoji(ctx, `${memberTag[0]} aka ${member.nickname}`, 202, 80, 50, 50)
  } else await drawEmoji(ctx, memberTag[0], 202, 80, 50, 50)
  ctx.fillStyle = 'gray'
  ctx.fillText(`#${memberTag[1]}`, 202, 147)
  if (member.user.bot) {
    let botRect = {
      x: 202 + ctx.measureText(`#${memberTag[1]}`).width + 25
    }
    ctx.font = '25px Whitney Medium'
    ctx.fillStyle = '#7289DA'
    ctx.save()

    botRect.w = ctx.measureText("BOT").width + 20,
      ctx.strokeStyle = "#7289DA"
    rectRounded(ctx, botRect.x, 115, botRect.w, 30, 5)
    ctx.clip()
    ctx.fillRect(botRect.x, 115, botRect.w, 30)
    ctx.restore()
    ctx.fillStyle = "white"
    ctx.fillText("BOT", botRect.x + 10, 140)
  }

  ctx.fillStyle = member.displayHexColor
  if (member.displayHexColor === "#000000") ctx.fillStyle = '#8e9297'

  ctx.fillRect(0, 178, canvas.width, 5)

  ctx.font = '40px Whitney Medium'
  ctx.fillStyle = 'white'
  ctx.fillText("Account Created", 25, 235)
  ctx.fillText("Guild joined", 25, 360)
  ctx.fillText("Join position", 25, 485)

  ctx.font = '25px Whitney Medium'
  ctx.fillStyle = '#a2a5a7'
  ctx.fillText(moment(member.user.createdAt).format("dddd Do MMMM YYYY, HH:mm:ss"), 25, 275)
  ctx.fillText(`Since ${moment.duration(Date.now() - member.user.createdAt).format("Y __, M __, D __, hh__ mm__ ss__")}`, 25, 305)
  ctx.fillText(moment(member.joinedAt).format("dddd Do MMMM YYYY, HH:mm:ss"), 25, 400)
  ctx.fillText(`Since ${moment.duration(Date.now() - member.joinedAt).format("Y __, M __, D __, hh__ mm__ ss__")}`, 25, 430)
  ctx.fillText(`${position}/${message.guild.memberCount}`, 25, 525)

  if (member.roles.cache.size > 1) {
    let roles = [];
    member.roles.cache.forEach(role => {
      roles[role.position] = role;
    });
    let highestRole = roles[roles.length - 1];

    ctx.font = '40px Whitney Medium'
    ctx.fillStyle = 'white'
    ctx.fillText("Highest role", canvas.width / 2 + 25, 485)

    ctx.font = '25px Whitney Medium'
    ctx.fillStyle = member.displayHexColor
    if (member.displayHexColor === "#000000") ctx.fillStyle = '#7289da'
    drawEmoji(ctx, `@${highestRole.name}`, canvas.width / 2 + 25, 525, 355)
    //ctx.fillText(`@${highestRole.name}`, canvas.width / 2 + 25, 525, 355)
    ctx.globalAlpha = 0.2
    ctx.fillRect(canvas.width / 2 + 20, 505, (ctx.measureText(`@${highestRole.name}`).width > 365) ? 365 : ctx.measureText(`@${highestRole.name}`).width + 10, 25)
    ctx.globalAlpha = 1
  }

  if (activity) {
    if (activity.type === "LISTENING") {
      ctx.fillStyle = "#01b664"
      ctx.fillRect(0, 550, canvas.width, 250)

      ctx.font = '45px Whitney Medium'
      ctx.fillStyle = 'white'
      ctx.fillText("Listening to Spotify", 25, 603)

      ctx.fillStyle = "#01b664"
      ctx.save()
      rectRounded(ctx, 25, 635, 128, 128, 30)
      ctx.clip()
      ctx.drawImage(await getImgCache(`https://i.scdn.co/image/${activity.assets.largeImage.replace("spotify:", "")}`), 25, 635, 128, 128) //`https://i.scdn.co/image/${activity.assets.largeImage.replace("spotify:", "")}`
      ctx.restore()
      ctx.fillStyle = "white"
      ctx.font = '35px Whitney Medium'
      ctx.fillText(textLimiter(activity.details, 36), 178, 670)
      ctx.font = '30px Whitney Medium'
      ctx.fillText(textLimiter(`by ${activity.state}`, 36), 178, 710)
      ctx.fillText(textLimiter(`on ${activity.assets.largeText}`, 36), 178, 750)

    } else if (activity.type === "CUSTOM_STATUS") {
      ctx.font = '30px Whitney Medium'
      ctx.fillStyle = "gray"
      if (activity.emoji) {
        let { url, name } = activity.emoji
        let emojiCode = twemoji.convert.toCodePoint(name)
        let link = url ? url : `https://twemoji.maxcdn.com/v/13.0.1/72x72/${emojiCode}.png`

        ctx.drawImage(await getImgCache(link), 25, 550, 72, 72)
        if (activity.state) await drawEmoji(ctx, textLimiter(activity.state, 49), 125,600, 30 ,30)

      } else await drawEmoji(ctx, textLimiter(activity.state, 63), 25,600, 30 ,30)

    } else if (activity.type === "STREAMING") {
      ctx.fillStyle = "#54338d"
      ctx.fillRect(0, 550, canvas.width, 300)

      ctx.font = '45px Whitney Medium'
      ctx.fillStyle = 'white'
      ctx.fillText("Streaming on Twitch", 25, 603)

      ctx.drawImage(await Canvas.loadImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${activity.assets.largeImage.replace("twitch:", "")}-1280x720.jpg`), 25, 625, 320, 180)


      ctx.font = '35px Whitney Medium'
      ctx.fillText(activity.details, 370, 700)

      ctx.font = '30px Whitney Medium'
      ctx.fillText(textLimiter(`Play at : ${activity.state}`, 32), 370, 750)

    } else if (activity.type === "PLAYING") {

      ctx.fillStyle = "#7289DA"
      ctx.fillRect(0, 550, canvas.width, 250)

      ctx.font = '45px Whitney Medium'
      ctx.fillStyle = 'white'
      ctx.fillText("Playing a game", 25, 603)

      if (activity.assets) { //if richpresence

        if (activity.assets.largeImage) {  //if image in richpresence
          ctx.fillStyle = "#7289DA"
          ctx.strokeStyle = "#7289DA"
          ctx.save()
          rectRounded(ctx, 25, 635, 128, 128, 30)
          ctx.clip()
          ctx.drawImage(await getImgCache(`https://cdn.discordapp.com/app-assets/${activity.applicationID}/${activity.assets.largeImage}.png`), 25, 635, 128, 128)
          ctx.restore()
          if (activity.assets.smallImage) {
            ctx.fillStyle = "#7289DA"
            drawCircle(145, 755, 29, ctx)
            ctx.save()
            drawCircle(145, 755, 24, ctx)
            drawCircle(145, 755, 24, ctx)
            ctx.clip()
            ctx.drawImage(await getImgCache(`https://cdn.discordapp.com/app-assets/${activity.applicationID}/${activity.assets.smallImage}.png`), 121, 731, 48, 48)
            ctx.restore()
          }

          if (!activity.timestamps) { //if no start time
            ctx.font = '35px Whitney Medium'
            ctx.fillStyle = 'white'
            ctx.fillText(textLimiter(activity.name, 39), 194, 660)

            ctx.font = '30px Whitney Medium'
            ctx.fillText(textLimiter(activity.details, 49), 194, 695)
            ctx.fillText(textLimiter(activity.state, 41), 194, 730)
          } else if (!activity.details) { //if no detail
            ctx.font = '35px Whitney Medium'
            ctx.fillStyle = 'white'
            ctx.fillText(textLimiter(activity.name, 39), 194, 660)

            ctx.font = '30px Whitney Medium'
            ctx.fillText(textLimiter(activity.state, 41), 194, 695)
            ctx.fillText(`Since ${moment.duration(Date.now() - activity.timestamps.start).format("Y __, M __, D __, hh __ mm __ ss __")}`, 194, 730)
          } else { //if all
            ctx.font = '35px Whitney Medium'
            ctx.fillStyle = 'white'
            ctx.fillText(textLimiter(activity.name, 39), 194, 660)

            ctx.font = '30px Whitney Medium'
            ctx.fillText(textLimiter(activity.details, 49), 194, 695)
            ctx.fillText(textLimiter(activity.state, 41), 194, 730)
            ctx.fillText(`Since ${moment.duration(Date.now() - activity.timestamps.start).format("Y __, M __, D __, hh __ mm __ ss __")}`, 194, 765)
          }

        } else {//if no image


          if (!activity.details && (!activity.timestamps.start || !activity.timestamps)) { //if no start time and detail
            ctx.font = '40px Whitney Medium'
            ctx.fillStyle = 'white'
            ctx.fillText(activity.name, 50, 680)

            ctx.font = '35px Whitney Medium'
            ctx.fillText(activity.state, 50, 740)
          } else if (!activity.timestamps || !activity.timestamps.start) { //if no start time
            ctx.font = '35px Whitney Medium'
            ctx.fillStyle = 'white'
            ctx.fillText(textLimiter(activity.name, 39), 50, 660)

            ctx.font = '30px Whitney Medium'
            ctx.fillText(textLimiter(activity.details, 49), 50, 695)
            ctx.fillText(textLimiter(activity.state, 41), 50, 730)
          } else if (!activity.details) { //if no detail
            ctx.font = '35px Whitney Medium'
            ctx.fillStyle = 'white'
            ctx.fillText(textLimiter(activity.name, 39), 50, 660)

            ctx.font = '30px Whitney Medium'
            ctx.fillText(textLimiter(activity.state, 41), 50, 695)
            ctx.fillText(textLimiter(`Since ${moment.duration(Date.now() - activity.timestamps.start).format("Y __, M __, D __, hh __ mm __ ss __")}`, 50), 194, 730)
          } else { //if all
            ctx.font = '35px Whitney Medium'
            ctx.fillStyle = 'white'
            ctx.fillText(activity.name, 50, 660)

            ctx.font = '30px Whitney Medium'
            ctx.fillText(activity.details, 50, 695)
            ctx.fillText(activity.state, 50, 730)
            ctx.fillText(textLimiter(`Since ${moment.duration(Date.now() - activity.timestamps.start).format("Y __, M __, D __, hh __ mm __ ss __")}`, 50), 50, 765)
          }
        }
      } else { //if no richpresence

        ctx.font = '40px Whitney Medium'
        ctx.fillStyle = 'white'
        ctx.fillText(textLimiter(activity.name, 44), 50, 680)

        ctx.font = '35px Whitney Medium'
        ctx.fillText(textLimiter(`Since ${moment.duration(Date.now() - activity.timestamps.start).format("Y __, M __, D __, hh __ mm __ ss __")}`, 50), 50, 745)

      }

    }
  }


  const attachment = await new MessageAttachment()
    .setFile(canvas.toBuffer())
    .setName("userinfo.png")

const embed = new MessageEmbed()
  .attachFiles(attachment)
  .setImage('attachment://userinfo.png')
  .setTimestamp()
  .setFooter(`Requested by ${message.author.tag}`)

  message.channel.send({ embed})
};
*/