import {CommandInteraction, Message, MessageActionRow, MessageButton, MessageEmbed, MessageEmbedOptions, MessageSelectMenu} from 'discord.js';
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
			const embed = new MessageEmbed({
				title: `Configuration for ${interaction.guild?.name}`,
				description: `<:Nothing:845679792204021800>Automoderation:
<:Nothing:845679792204021800><:Nothing:845679792204021800>AntiLink: ${config.antilink ? '<:Check:803931708972990474>' : '<:Notcheck:803931708255895632>'}
<:Nothing:845679792204021800><:Nothing:845679792204021800>AntiUpperCase: ${config.anitupper ? '<:Check:803931708972990474>' : '<:Notcheck:803931708255895632>'}
<:Nothing:845679792204021800><:Nothing:845679792204021800>AntiSpam: ${config.antispam ? '<:Check:803931708972990474>' : '<:Notcheck:803931708255895632>'}
<:Nothing:845679792204021800><:Nothing:845679792204021800>AntiDuplicated: ${
					config.antiduplicated ? '<:Check:803931708972990474>' : '<:Notcheck:803931708255895632>'
				}

<:Nothing:845679792204021800>LinkPreview: ${config.linkpreview ? '<:Check:803931708972990474>' : '<:Notcheck:803931708255895632>'}

<:Nothing:845679792204021800>DynamicVoiceBase: ${config.dynamicVoiceBase ? `<#${config.dynamicVoiceBase}` : 'Null'}

Select an option to see more in details its configuration and description`,
				color: 'ORANGE',
			});

			const row = new MessageActionRow({
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
			});

			const embeds = (bool: boolean) => {
				return {
					antilink: new MessageEmbed({
						title: `Configuration for ${interaction.guild?.name}`,
						description: `<:Nothing:845679792204021800>Informations:
    The AntiLink feature, wich is in the Automoderation System of fant0mib0t, will warn everyone who will send an invite link that is not allowed
    <:Nothing:845679792204021800>Curent state: ${bool ? '<:Check:803931708972990474>' : '<:Notcheck:803931708255895632>'}

    To change it or to return to the base menu use the buttons bellow`,
					}),
					anitupper: new MessageEmbed({
						title: `Configuration for ${interaction.guild?.name}`,
						description: `<:Nothing:845679792204021800>Informations:
    The AntiUpperCase feature, wich is in the Automoderation System of fant0mib0t, will warn everyone who will send a message with a lot of UpperCases
    <:Nothing:845679792204021800>Curent state: ${bool ? '<:Check:803931708972990474>' : '<:Notcheck:803931708255895632>'}

    To change it or to return to the base menu use the buttons bellow`,
					}),
					antispam: new MessageEmbed({
						title: `Configuration for ${interaction.guild?.name}`,
						description: `<:Nothing:845679792204021800>Informations:
    The AntiSpam feature, wich is in the Automoderation System of fant0mib0t, will warn everyone who will send a lot of messages in a close timing
    <:Nothing:845679792204021800>Curent state: ${bool ? '<:Check:803931708972990474>' : '<:Notcheck:803931708255895632>'}

    To change it or to return to the base menu use the buttons bellow`,
					}),
					antiduplicated: new MessageEmbed({
						title: `Configuration for ${interaction.guild?.name}`,
						description: `<:Nothing:845679792204021800>Informations:
    The AntiDuplicated feature, wich is in the Automoderation System of fant0mib0t, will warn everyone who will send message with a lot of the same caracters
    <:Nothing:845679792204021800>Curent state: ${bool ? '<:Check:803931708972990474>' : '<:Notcheck:803931708255895632>'}

    To change it or to return to the base menu use the buttons bellow`,
					}),
					linkpreview: new MessageEmbed({
						title: `Configuration for ${interaction.guild?.name}`,
						description: `<:Nothing:845679792204021800>Informations:
    The LinkPreview feature will send, when someone send a discord message link, the recreation of the message
    <:Nothing:845679792204021800>Curent state: ${bool ? '<:Check:803931708972990474>' : '<:Notcheck:803931708255895632>'}

    To change it or to return to the base menu use the buttons bellow`,
					}),
				};
			};

			const toogleRow = (bool: boolean) =>
				new MessageActionRow({
					components: [
						new MessageButton({
							label: bool ? 'Disable' : 'Activate',
							style: bool ? 'DANGER' : 'SUCCESS',
							customId: 'toogle',
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

			await interaction.reply({embeds: [embed], components: [row]});
			const msg = (await interaction.fetchReply()) as Message;

			const col = msg.createMessageComponentCollector({
				time: 60000,
			});
			col.on('collect', async i => {
				if (i.user.id != interaction.user.id) {
					i.deferUpdate();
				} else {
					if (i.isSelectMenu()) {
						if (i.customId !== 'dynamicvoice') {
							const bool = (config as any)[i.customId] as boolean;
							const embed = (embeds(bool) as any)[i.customId] as MessageEmbed;
							const row = toogleRow(bool);
							i.update({embeds: [embed], components: [row]});
						}
					} else {
						if (i.customId === 'toogle') {
							const bool = !((config as any)[i.customId] as boolean);
							(config as any)[i.customId] = bool;
							const embed = (embeds(bool) as any)[i.customId] as MessageEmbed;
							const row = toogleRow(bool);
							i.update({embeds: [embed], components: [row]});
						} else if (i.customId === 'close') {
							i.deferUpdate();
							msg.delete();
							col.stop();
						} else if (i.customId === 'back') {
							i.update({embeds: [embed], components: [row]});
						}
					}
				}
			});
		});
	},
	{
		user: {
			perms: ['ADMINISTRATOR'],
		},
	}
);
