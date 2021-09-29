import {CommandInteraction, Message, MessageActionRow, MessageEmbed, MessageSelectMenu} from 'discord.js';
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
			if (!res.length) {
				config = defaultConfig;
				config.id = interaction.guild?.id ?? '';
			} else {
				config = res[0];
			}
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

			await interaction.reply({embeds: [embed], components: [row]});
			const msg = (await interaction.fetchReply()) as Message;

			const col = msg.createMessageComponentCollector({
				componentType: 'SELECT_MENU',
				time: 60000,
			});
			col.on('collect', async i => {
				if (i.user.id != interaction.user.id) {
					i.deferUpdate();
				} else {
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
