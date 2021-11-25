import {Activity, ActivityFlags, ContextMenuInteraction, GuildMember, MessageAttachment, MessageEmbed} from 'discord.js';
import {ContextMenu, Bot} from '../utils/class';
import {drawEmoji, formatTime, stringifyTime} from '../utils/functions';
import {createCanvas, loadImage} from 'canvas';
import moment from 'moment';

async function getMostColorImage(link: string) {
  const img = await loadImage(link),
    height = img.naturalHeight || img.height,
    width = img.naturalWidth || img.width,
    canvas = createCanvas(width, height),
    ctx = canvas.getContext('2d'),
    allColors: any = {};

  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, width, height).data;

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 100) {
      const hex = '#' + ((1 << 24) + (data[i] << 16) + (data[i + 1] << 8) + data[i + 2]).toString(16).slice(1);
      allColors[hex] = (allColors[hex] ?? 0) + 1;
    }
  }
  return Object.entries(allColors)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .map(r => r[0])[0];
}

const statusIcon = {
  dnd: 'https://cdn.discordapp.com/emojis/702869991711572058.png?v=1',
  idle: 'https://cdn.discordapp.com/emojis/702870951947403264.png?v=1',
  offline: 'https://cdn.discordapp.com/emojis/702869986791653437.png?v=1',
  online: 'https://cdn.discordapp.com/emojis/702869993041428543.png?v=1',
};

export default new ContextMenu(
  {
    name: 'Get information',
    type: 'USER',
  },
  async (client: Bot, interaction: ContextMenuInteraction) => {
    await interaction.deferReply();
    let member = interaction.guild?.members.cache.get(interaction.targetId) as GuildMember;
    const position = interaction.guild?.members.cache.sort((a, b) => (a.joinedTimestamp ?? 0) - (b.joinedTimestamp ?? 0)).map(r => r.id) as string[];
    const user = member.user;
    const link = user.displayAvatarURL({format: 'png'});

    const act = member.presence?.activities.find(r => r.type === 'LISTENING' || r.type === 'STREAMING' || r.type === 'PLAYING');
    const canvas = createCanvas(800, act ? (user.bot ? 780 : 930) : 700);
    console.log('t');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#23272A';
    ctx.fillRect(0, 0, 800, 180);

    ctx.fillStyle = await getMostColorImage(link);
    ctx.fillRect(0, 180, 800, 8);

    ctx.fillStyle = '#2C2F33';
    ctx.fillRect(0, 187, 800, 500);

    const loadLink = await loadImage(link);
    ctx.drawImage(loadLink, 25, 25, 130, 130);

    ctx.fillStyle = '#23272A';
    ctx.beginPath();
    ctx.arc(140, 140, 30, 0, 2 * Math.PI, false);
    ctx.fill();

    /*const loadStatus = await loadImage((statusIcon as any)[member.presence?.status ?? ""])
        ctx.drawImage(loadStatus, 120, 120, 40, 40);*/

    ctx.fillStyle = '#FFF';
    ctx.font = '50px Whitney Medium';
    await drawEmoji(ctx, user.username, 205, 75, 50, 50);

    ctx.fillStyle = '#808080';
    ctx.fillText(user.discriminator, 250, 140);
    ctx.font = 'italics 50px Whitney Medium';
    ctx.fillText('#', 205, 140);
    console.log('t');
    if (user.bot) {
      const verified = (user.flags?.toArray() ?? []).includes('VERIFIED_BOT');
      ctx.fillStyle = '#7289DA';
      ctx.fillRect(400, 100, 80 + (verified ? 40 : 0), 50);

      ctx.fillStyle = '#FFF';
      if (verified) {
        ctx.font = '50px Whitney Medium';
        ctx.fillText('✓', 410, 144);
      }
      ctx.font = '30px Whitney Medium';
      ctx.fillText('BOT', 410 + (verified ? 40 : 0), 138);
    }
    console.log('t');
    ctx.fillStyle = '#FFF';
    ctx.font = '45px Whitney Medium';
    ctx.fillText('Account Created', 25, 260);
    ctx.fillText('Guild Joined', 25, 400);
    ctx.fillText('Join Position', 25, 540);
    ctx.fillText('Highest Role', 375, 540);

    ctx.fillStyle = '#808080';
    ctx.font = '27px Whitney Medium';
    ctx.fillText(moment(user.createdTimestamp).toString(), 25, 310);
    // "Y __, M __, D __, hh__ mm__ ss__"
    ctx.fillText(moment(member.joinedTimestamp).toString() /*+"\n"+moment.duration(Date.now() - (member.joinedAt?.getDate() ?? 0))*/, 25, 450);
    ctx.fillText(position.indexOf(user.id) + 1 + '/' + position.length, 25, 590);

    ctx.font = '30px Whitney Medium';
    let highestRole = member.roles.highest,
      highcolor = highestRole.hexColor != '#000000' ? highestRole.hexColor : '#808080';
    ctx.fillStyle = highcolor + '33';
    let width = ctx.measureText('@' + highestRole.name).width;
    ctx.font = '27px Whitney Medium';
    ctx.fillRect(375, 590 - 24, width, 30);
    ctx.fillStyle = highcolor;
    await drawEmoji(ctx, '@' + highestRole.name, 375, 590, 30, 30);
    console.log('t');
    let customeStatus = member.presence?.activities.find(r => r.type === 'CUSTOM');
    if (member.presence?.activities.find(r => r.type === 'PLAYING')) {
      let activity = member.presence.activities.find(r => r.type === 'PLAYING') as Activity;
      ctx.fillStyle = '#7289DA';
      ctx.fillRect(0, 685, 800, 250);

      ctx.font = '45px Whitney Medium';
      ctx.fillStyle = '#fff';
      ctx.fillText('Playing a game', 25, 740);

      if (activity.assets?.largeImage) {
        const loadGame = await loadImage(`https://cdn.discordapp.com/app-assets/${activity.applicationId}/${activity.assets.largeImage}.png`);
        ctx.drawImage(loadGame, 25, 785, 128, 128);
      }
      if (activity.assets?.smallImage) {
        ctx.fillStyle = '#7289DA';
        ctx.beginPath();
        ctx.arc(115 + 24, 875 + 24, 29, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.arc(115 + 24, 875 + 24, 24, 0, 2 * Math.PI, false);
        ctx.clip();
        const loadGame = await loadImage(`https://cdn.discordapp.com/app-assets/${activity.applicationId}/${activity.assets.smallImage}.png`);
        ctx.drawImage(loadGame, 115, 875, 48, 48);
        ctx.restore();
      }
      console.log('t');
      ctx.fillStyle = '#fff';
      ctx.font = '35px Whitney Medium';
      if (activity.name) await drawEmoji(ctx, activity.name, 178, 820, 35, 35);
      ctx.font = '30px Whitney Medium';
      if (activity.details) await drawEmoji(ctx, activity.details, 178, 860, 30, 30);
      if (activity.state) await drawEmoji(ctx, activity.state, 178, 890, 30, 30);
      if (activity?.timestamps?.start)
        await drawEmoji(
          ctx,
          `Since ${stringifyTime(Date.now() - activity.timestamps.start.getTime(), {
            suppressTag: true,
            format: 'H-M-S',
            valueNull: true,
            separator: ':',
            lang: 'en',
            long: false,
          })}`,
          178,
          920,
          30,
          30
        );

      if (activity.name && !customeStatus && user.bot) {
        let activity_to_push: Activity = {
          applicationId: null,
          assets: null,
          buttons: [],
          createdAt: new Date(),
          createdTimestamp: 0,
          details: null,
          emoji: null,
          id: '',
          name: '',
          party: null,
          platform: null,
          sessionId: null,
          state: null,
          syncId: null,
          timestamps: null,
          url: null,
          equals: (activity: Activity) => true,
          flags: new ActivityFlags(),
          type: 'PLAYING',
        };
        activity_to_push.type = 'CUSTOM';
        activity_to_push.state = activity.name;
        member.presence.activities.push(activity_to_push);
      }
    } else if (member.presence?.activities.find(r => r.type === 'STREAMING')) {
      let activity = member.presence.activities.find(r => r.type === 'STREAMING');
      ctx.fillStyle = '#54338d';
      ctx.fillRect(0, 685, 800, 250);
      console.log('t');
      ctx.font = '45px Whitney Medium';
      ctx.fillStyle = '#fff';
      ctx.fillText('Streaming on Twitch', 25, 740);

      if (activity?.assets?.largeImage) {
        const loadSpotify = await loadImage(
          `https://static-cdn.jtvnw.net/previews-ttv/live_user_${activity.assets.largeImage.replace('twitch:', '')}-1280x720.jpg`
        );
        ctx.drawImage(loadSpotify, 25, 785, 128, 128);
      }
      ctx.fillStyle = '#fff';
      ctx.font = '35px Whitney Medium';
      if (activity?.details) await drawEmoji(ctx, activity.details, 178, 820, 35, 35);
      ctx.font = '30px Whitney Medium';
      if (activity?.state) await drawEmoji(ctx, `Play at : ${activity.state}`, 178, 860, 30, 30);

      if (activity?.name && !customeStatus && user.bot) {
        let activity_to_push: Activity = {
          applicationId: null,
          assets: null,
          buttons: [],
          createdAt: new Date(),
          createdTimestamp: 0,
          details: null,
          emoji: null,
          id: '',
          name: '',
          party: null,
          platform: null,
          sessionId: null,
          state: null,
          syncId: null,
          timestamps: null,
          url: null,
          equals: (activity: Activity) => true,
          flags: new ActivityFlags(),
          type: 'PLAYING',
        };
        activity_to_push.type = 'CUSTOM';
        activity_to_push.state = 'Streaming ' + activity.name;
        member.presence.activities.push(activity_to_push);
      }
    } else if (member.presence?.activities.find(r => r.type === 'LISTENING')) {
      let activity = member.presence.activities.find(r => r.type === 'LISTENING');
      ctx.fillStyle = '#01b664';
      ctx.fillRect(0, 685, 800, 250);

      ctx.font = '45px Whitney Medium';
      ctx.fillStyle = '#fff';
      ctx.fillText('Listening to Spotify', 25, 740);

      if (activity?.assets?.largeImage) {
        const loadSpotify = await loadImage(`https://i.scdn.co/image/${activity.assets.largeImage.replace('spotify:', '')}`);
        ctx.drawImage(loadSpotify, 25, 785, 128, 128);
      }
      ctx.fillStyle = '#fff';
      ctx.font = '35px Whitney Medium';
      if (activity?.details) await drawEmoji(ctx, activity.details, 178, 820, 35, 35);
      ctx.font = '30px Whitney Medium';
      if (activity?.state) await drawEmoji(ctx, `by ${activity.state}`, 178, 860, 30, 30);
      if (activity?.assets?.largeText) await drawEmoji(ctx, `on ${activity.assets?.largeText}`, 178, 890, 30, 30);

      if (activity?.name && !customeStatus && user.bot) {
        let activity_to_push: Activity = {
          applicationId: null,
          assets: null,
          buttons: [],
          createdAt: new Date(),
          createdTimestamp: 0,
          details: null,
          emoji: null,
          id: '',
          name: '',
          party: null,
          platform: null,
          sessionId: null,
          state: null,
          syncId: null,
          timestamps: null,
          url: null,
          equals: (activity: Activity) => true,
          flags: new ActivityFlags(),
          type: 'PLAYING',
        };
        activity_to_push.type = 'CUSTOM';
        activity_to_push.state = 'Listening ' + activity.name;
        member.presence.activities.push(activity_to_push);
      }
    }

    customeStatus = member.presence?.activities.find(r => r.type === 'CUSTOM');
    if (customeStatus) {
      let x = 25;
      if (customeStatus.emoji) {
        x = 90;
        if (customeStatus.emoji.id) {
          const LoadEmoji = await loadImage(`https://cdn.discordapp.com/emojis/${customeStatus.emoji.id}.png?v=1`);
          ctx.drawImage(LoadEmoji, 25, 620, 60, 60);
        } else await drawEmoji(ctx, customeStatus.emoji.name ?? '', 25, 670, 60, 60);
      }
      let p1 = customeStatus.state as string;
      let p2 = '';
      if (p1.length > 45) {
        for (let i = 0; i < (customeStatus.state?.length ?? 0); i++) {
          p1 = customeStatus.state?.slice(0, i) as string;
          p2 = customeStatus.state?.slice(i) as string;
          if (i > 40) {
            if ((customeStatus.state as string)[i] == ' ') {
              break;
            } else if (i == 45) break;
          }
        }
      }
      ctx.font = '25px Whitney Medium';
      ctx.fillStyle = '#FFF';
      await drawEmoji(ctx, p1, x, 645, 25, 25);
      await drawEmoji(ctx, p2, x, 665, 25, 25);
    }
    const embed = new MessageEmbed().setColor('#ED2222').setImage('attachment://t.png');

    const attachement = new MessageAttachment(canvas.toBuffer(), 't.png');
    console.log('t');
    interaction.editReply({
      embeds: [embed],
      files: [attachement],
    });
  },
  {
    user: {
      perms: ['ADMINISTRATOR'],
    },
  }
);
