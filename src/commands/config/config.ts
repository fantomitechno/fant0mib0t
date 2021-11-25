import {CommandInteraction, GuildChannel, InteractionCollector, Message, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu} from 'discord.js';
import {MysqlError} from 'mysql';
import {Command, Bot} from '../../utils/class';
import {Config, defaultConfig} from '../../utils/types';

export default new Command(
  {
    name: 'config',
    description: 'Configure some thingies',
  },
  async (client: Bot, interaction: CommandInteraction) => {
    client.query(`SELECT * FROM config WHERE id = '${interaction.guild?.id}'`, async (err: MysqlError, res: Config[]) => {
      let config: Config;
      //if (!res.length) {
      config = defaultConfig;
      config.id = interaction.guild?.id ?? '';
      //} else {
      //	config = res[0];
      //}
      let embed = new MessageEmbed({
        title: `Configuration for ${interaction.guild?.name}`,
        description: `<:Nothing:893175030534508545> **Automoderation:**
<:Nothing:893175030534508545> <:Nothing:893175030534508545> ・ AntiLink: ${config.antilink ? '<:Check:893175073756839996>' : '<:Notcheck:893175054991511592>'}
<:Nothing:893175030534508545> <:Nothing:893175030534508545> ・ AntiUpperCase: ${
          config.anitupper ? '<:Check:893175073756839996>' : '<:Notcheck:893175054991511592>'
        }
<:Nothing:893175030534508545> <:Nothing:893175030534508545> ・ AntiSpam: ${config.antispam ? '<:Check:893175073756839996>' : '<:Notcheck:893175054991511592>'}
<:Nothing:893175030534508545> <:Nothing:893175030534508545> ・ AntiDuplicated: ${
          config.antiduplicated ? '<:Check:893175073756839996>' : '<:Notcheck:893175054991511592>'
        }

<:Nothing:893175030534508545> **LinkPreview:** ${config.linkpreview ? '<:Check:893175073756839996>' : '<:Notcheck:893175054991511592>'}

<:Nothing:893175030534508545> **DynamicVoiceBase:** ${config.dynamicVoiceBase ? `<#${config.dynamicVoiceBase}>` : 'Null'}

Select an option to see more in details its configuration and description`,
        color: 'ORANGE',
      });

      const row = [
        new MessageActionRow({
          components: [
            new MessageSelectMenu({
              customId: `config-menu`,
              placeholder: `Nothing selected`,
              options: [
                {
                  label: `AutoMod AntiLink`,
                  description: `Antilink feature`,
                  value: 'antilink',
                },
                {
                  label: `AutoMod AntiUpperCase`,
                  description: `AntiUpperCase feature`,
                  value: 'anitupper',
                },
                {
                  label: `AutoMod AntiSpam`,
                  description: `AntiSpam feature`,
                  value: 'antispam',
                },
                {
                  label: `AutoMod AntiDuplicated`,
                  description: `AntiDuplicated feature`,
                  value: 'antiduplicated',
                },
                {
                  label: `LinkPreview`,
                  description: `LinkPreview feature`,
                  value: 'linkpreview',
                },
                {
                  label: `DynamicVoice`,
                  description: `DynamicVoice feature`,
                  value: 'dynamicvoice',
                },
              ],
            }),
          ],
        }),
        new MessageActionRow({
          components: [
            new MessageButton({
              label: 'Close menu',
              style: 'PRIMARY',
              customId: 'close',
            }),
          ],
        }),
      ];

      const embeds = (bool: boolean, str: string): MessageEmbed => {
        let description = '';
        switch (str) {
          case 'antilink':
            description = `<:Nothing:893175030534508545> Informations:
The AntiLink feature, wich is in the Automoderation System of fant0mib0t, will warn everyone who will send an invite link that is not allowed
<:Nothing:893175030534508545> Curent state: ${bool ? '<:Check:893175073756839996>' : '<:Notcheck:893175054991511592>'}

To change it or to return to the base menu use the buttons bellow`;
            return new MessageEmbed({
              title: `Configuration for ${interaction.guild?.name}`,
              description,
              color: 'ORANGE',
            });
          case 'anitupper':
            description = `<:Nothing:893175030534508545> Informations:
The AntiUpperCase feature, wich is in the Automoderation System of fant0mib0t, will warn everyone who will send a message with a lot of UpperCases
<:Nothing:893175030534508545> Curent state: ${bool ? '<:Check:893175073756839996>' : '<:Notcheck:893175054991511592>'}

To change it or to return to the base menu use the buttons bellow`;
            return new MessageEmbed({
              title: `Configuration for ${interaction.guild?.name}`,
              description,
              color: 'ORANGE',
            });
          case 'antispam':
            description = `<:Nothing:893175030534508545> Informations:
The AntiSpam feature, wich is in the Automoderation System of fant0mib0t, will warn everyone who will send a lot of messages in a close timing
<:Nothing:893175030534508545> Curent state: ${bool ? '<:Check:893175073756839996>' : '<:Notcheck:893175054991511592>'}

To change it or to return to the base menu use the buttons bellow`;
            return new MessageEmbed({
              title: `Configuration for ${interaction.guild?.name}`,
              description,
              color: 'ORANGE',
            });
          case 'antiduplicated':
            description = `<:Nothing:893175030534508545> Informations:
The AntiDuplicated feature, wich is in the Automoderation System of fant0mib0t, will warn everyone who will send message with a lot of the same caracters
<:Nothing:893175030534508545> Curent state: ${bool ? '<:Check:893175073756839996>' : '<:Notcheck:893175054991511592>'}

To change it or to return to the base menu use the buttons bellow`;
            return new MessageEmbed({
              title: `Configuration for ${interaction.guild?.name}`,
              description,
              color: 'ORANGE',
            });
          case 'linkpreview':
            description = `<:Nothing:893175030534508545> Informations:
The LinkPreview feature will send, when someone send a discord message link, the recreation of the message
<:Nothing:893175030534508545> Curent state: ${bool ? 'Automatic' : 'Only ContextMenu'}

To change it or to return to the base menu use the buttons bellow`;
            return new MessageEmbed({
              title: `Configuration for ${interaction.guild?.name}`,
              description,
              color: 'ORANGE',
            });
        }
        return new MessageEmbed({
          description: 'wut',
        });
      };

      const toogleRow = (bool: boolean, str: string) =>
        new MessageActionRow({
          components: [
            new MessageButton({
              label: bool ? 'Disable' : 'Activate',
              style: bool ? 'DANGER' : 'SUCCESS',
              customId: 'toogle-' + str,
            }),
            new MessageButton({
              label: 'Close menu',
              style: 'PRIMARY',
              customId: 'close',
            }),
            new MessageButton({
              label: 'Go back',
              style: 'SECONDARY',
              customId: 'back',
            }),
          ],
        });

      await interaction.reply({embeds: [embed], components: row});
      const msg = (await interaction.fetchReply()) as Message;

      const col = msg.createMessageComponentCollector({
        time: 60000,
      });
      col.on('collect', async i => {
        if (i.user.id != interaction.user.id) {
          i.deferUpdate();
        } else {
          if (i.isSelectMenu()) {
            if (i.values[0] !== 'dynamicvoice') {
              const bool = (config as any)[i.values[0]] as boolean;
              const embed = embeds(bool, i.values[0]);
              const row = toogleRow(bool, i.values[0]);
              i.update({embeds: [embed], components: [row]});
            } else {
              const value = config.dynamicVoiceBase;
              const embed = new MessageEmbed({
                title: `Configuration for ${interaction.guild?.name}`,
                description: `<:Nothing:893175030534508545> Informations:
The DynamicVoiceBase channel will create, when anyone join it, a personal voice channel in its category
Creator has every perms on it and name and generate randomly with the help of an API. There's also some Easter Egg in the names. Go and find them all !
<:Nothing:893175030534508545> Curent state: ${value ? `<#${value}>` : 'Null'}

To change it or to return to the base menu use the buttons bellow`,
                color: 'ORANGE',
              });
              const row = new MessageActionRow({
                components: [
                  new MessageButton({
                    label: 'Change the value',
                    style: 'SUCCESS',
                    customId: 'dynamicvoice',
                  }),
                  new MessageButton({
                    label: 'Reset value',
                    style: 'DANGER',
                    customId: 'resetvoice',
                  }),
                  new MessageButton({
                    label: 'Close menu',
                    style: 'PRIMARY',
                    customId: 'close',
                  }),
                  new MessageButton({
                    label: 'Go back',
                    style: 'SECONDARY',
                    customId: 'back',
                  }),
                ],
              });
              i.update({embeds: [embed], components: [row]});
            }
          } else {
            if (i.customId.startsWith('toogle')) {
              const bool = !((config as any)[i.customId] as boolean);
              (config as any)[i.customId] = bool;
              const embed = embeds(bool, i.customId.replace('toogle-', ''));
              const row = toogleRow(bool, i.customId.replace('toogle-', ''));
              i.update({embeds: [embed], components: [row]});
            } else if (i.customId === 'dynamicvoice') {
              await i.reply({content: `Use /dynamicvoice <channel>`});
              const reply = (await i.fetchReply()) as Message;
              const col = new InteractionCollector(client, {
                channel: interaction.channel ?? undefined,
                interactionType: 'APPLICATION_COMMAND',
              });
              interaction.guild?.commands
                .create({
                  name: 'dynamicvoice',
                  description: 'Configure the DynamicVoiceBase',
                  defaultPermission: false,
                  options: [
                    {
                      name: 'channel',
                      type: 'CHANNEL',
                      description: 'The channel you want',
                      required: true,
                    },
                  ],
                })
                .then(c => {
                  c.permissions.add({
                    permissions: [
                      {
                        id: interaction.user.id,
                        type: 'USER',
                        permission: true,
                      },
                    ],
                  });
                  col.on('collect', async (cmd: CommandInteraction) => {
                    if (cmd.commandName !== 'dynamicvoice') return;
                    let channel = cmd.options.getChannel('channel', true) as GuildChannel;
                    if (!channel.isVoice()) {
                      cmd.reply({content: `You have to choose a VoiceChannel`, ephemeral: true});
                    } else {
                      config.dynamicVoiceBase = channel.id;
                      cmd.reply({content: `Config have been updated`});
                      col.stop();
                      const value = config.dynamicVoiceBase;
                      const embed = new MessageEmbed({
                        title: `Configuration for ${interaction.guild?.name}`,
                        description: `<:Nothing:893175030534508545> Informations:
			The DynamicVoiceBase channel will create, when anyone join it, a personal voice channel in its category
			Creator has every perms on it and name and generate randomly with the help of an API. There's also some Easter Egg in the names. Go and find them all !
			<:Nothing:893175030534508545> Curent state: ${value ? `<#${value}>` : 'Null'}
	
			To change it or to return to the base menu use the buttons bellow`,
                        color: 'ORANGE',
                      });
                      const row = new MessageActionRow({
                        components: [
                          new MessageButton({
                            label: 'Change the value',
                            style: 'SUCCESS',
                            customId: 'dynamicvoice',
                          }),
                          new MessageButton({
                            label: 'Reset value',
                            style: 'DANGER',
                            customId: 'resetvoice',
                          }),
                          new MessageButton({
                            label: 'Close menu',
                            style: 'PRIMARY',
                            customId: 'close',
                          }),
                          new MessageButton({
                            label: 'Go back',
                            style: 'SECONDARY',
                            customId: 'back',
                          }),
                        ],
                      });
                      msg.edit({embeds: [embed], components: [row]});
                      reply.delete().catch(_ => _);
                    }
                  });
                  col.on('end', async (_, __) => {
                    c.delete();
                  });
                })
                .catch(_ => _);
            } else if (i.customId === 'resetvoice') {
              config.dynamicVoiceBase = undefined;
              const value = config.dynamicVoiceBase;
              const embed = new MessageEmbed({
                title: `Configuration for ${interaction.guild?.name}`,
                description: `<:Nothing:893175030534508545> Informations:
The DynamicVoiceBase channel will create, when anyone join it, a personal voice channel in its category
Creator has every perms on it and name and generate randomly with the help of an API. There's also some Easter Egg in the names. Go and find them all !
<:Nothing:893175030534508545> Curent state: ${value ? `<#${value}>` : 'Null'}

To change it or to return to the base menu use the buttons bellow`,
                color: 'ORANGE',
              });
              const row = new MessageActionRow({
                components: [
                  new MessageButton({
                    label: 'Change the value',
                    style: 'SUCCESS',
                    customId: 'dynamicvoice',
                  }),
                  new MessageButton({
                    label: 'Reset value',
                    style: 'DANGER',
                    customId: 'resetvoice',
                  }),
                  new MessageButton({
                    label: 'Close menu',
                    style: 'PRIMARY',
                    customId: 'close',
                  }),
                  new MessageButton({
                    label: 'Go back',
                    style: 'SECONDARY',
                    customId: 'back',
                  }),
                ],
              });
              i.update({embeds: [embed], components: [row]});
            } else if (i.customId === 'close') {
              i.update({content: `Config menu was closed`, embeds: [], components: []});
              col.stop();
            } else if (i.customId === 'back') {
              embed = new MessageEmbed({
                title: `Configuration for ${interaction.guild?.name}`,
                description: `<:Nothing:893175030534508545> **Automoderation:**
				<:Nothing:893175030534508545> <:Nothing:893175030534508545> ・ AntiLink: ${config.antilink ? '<:Check:893175073756839996>' : '<:Notcheck:893175054991511592>'}
				<:Nothing:893175030534508545> <:Nothing:893175030534508545> ・ AntiUpperCase: ${
          config.anitupper ? '<:Check:893175073756839996>' : '<:Notcheck:893175054991511592>'
        }
				<:Nothing:893175030534508545> <:Nothing:893175030534508545> ・ AntiSpam: ${config.antispam ? '<:Check:893175073756839996>' : '<:Notcheck:893175054991511592>'}
				<:Nothing:893175030534508545> <:Nothing:893175030534508545> ・ AntiDuplicated: ${
          config.antiduplicated ? '<:Check:893175073756839996>' : '<:Notcheck:893175054991511592>'
        }
				
				<:Nothing:893175030534508545> **LinkPreview:** ${config.linkpreview ? '<:Check:893175073756839996>' : '<:Notcheck:893175054991511592>'}
				
				<:Nothing:893175030534508545> **DynamicVoiceBase:** ${config.dynamicVoiceBase ? `<#${config.dynamicVoiceBase}>` : 'Null'}
				
				Select an option to see more in details its configuration and description`,
                color: 'ORANGE',
              });
              i.update({embeds: [embed], components: row});
            }
          }
        }
      });
      col.on('end', async (c, r) => {
        // là on update la config
        msg.edit({content: `Config menu was closed`, embeds: [], components: []});
      });
    });
  },
  {
    user: {
      perms: ['ADMINISTRATOR'],
    },
  }
);
