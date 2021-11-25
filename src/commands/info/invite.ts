import {CommandInteraction, MessageActionRow, MessageSelectMenu, Message, MessageButton} from 'discord.js';
import {Command, Bot, propertyInEnum} from '../../utils/class';

export default new Command(
  {
    name: 'invite',
    description: 'Get the bot invitation',
  },
  async (client: Bot, interaction: CommandInteraction) => {
    const awser = {
      own: '🤖・Bot - Choosing permissions',
      min: '🤖・Bot - The minimum permissions',
      support: '🎟️・Support',
    };

    const awser2 = {
      own: 'https://discordapp.com/oauth2/authorize?client_id=684100826914226283&scope=bot+applications.commands&permissions=-1',
      min: 'https://discordapp.com/oauth2/authorize?client_id=684100826914226283&scope=bot+applications.commands&permissions=-1',
      support: 'https://discord.gg/x9BMZ6z',
    };

    const row = new MessageActionRow({
      components: [
        new MessageSelectMenu({
          customId: 'invite',
          placeholder: 'List of invitations :',
          options: [
            {
              label: '🤖・Bot',
              description: 'Choosing permissions',
              value: 'own',
            },
            {
              label: '🤖・Bot',
              description: 'The minimum permissions',
              value: 'min',
            },
            {
              label: '🎟️・Support',
              description: 'Invitation on the support',
              value: 'support',
            },
          ],
        }),
      ],
    });
    await interaction.reply({components: [row], content: 'Select the invite you want'});
    const msg = (await interaction.fetchReply()) as Message;

    const collector = msg.createMessageComponentCollector({componentType: 'SELECT_MENU', time: 15000});
    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) return i.reply({content: 'This menu is not for you', ephemeral: true});
      if (i.isSelectMenu()) {
        const row = new MessageActionRow({
          components: [
            new MessageButton({
              label: propertyInEnum(awser, i.values[0]),
              style: 'LINK',
              url: propertyInEnum(awser2, i.values[0]) ?? '',
            }),
          ],
        });
        i.update({components: [row], content: 'Your invite'});
      }
    });
  }
);
