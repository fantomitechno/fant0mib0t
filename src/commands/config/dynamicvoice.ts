import {CommandInteraction, InteractionCollector, Message, MessageActionRow, MessageButton, MessageEmbed, MessageEmbedOptions, MessageSelectMenu} from 'discord.js';
import {MysqlError} from 'mysql';
import {Command, Bot} from '../../utils/class';
import {Config, defaultConfig} from '../../utils/types';

export default new Command(
	{
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
	},
	async (client: Bot, interaction: CommandInteraction) => {
		return
	},
	{
		user: {
			perms: ['ADMINISTRATOR']
		},
	}
);
