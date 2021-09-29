import {CommandInteraction, MessageEmbed} from 'discord.js';
import {Command, Bot} from '../../utils/class';
import {transpile} from 'typescript';
import {inspect} from 'util';

export default new Command(
	{
		name: 'eval',
		description: 'Evaluate some code',
		options: [
			{
				name: 'code',
				type: 'STRING',
				description: 'The code to evaluate',
				required: true,
			},
		],
		defaultPermission: false,
	},
	async (client: Bot, interaction: CommandInteraction) => {
		try {
			const code = interaction.options.getString('code', true);
			const result = transpile(code);
			const ev: any = eval(result);
			let str = inspect(ev, {
				depth: 1,
			});
			str = `${str.replace(new RegExp(`${client?.token}`, 'g'), '')}`;
			if (str.length > 1800) {
				let ss = str.substr(0, 1800);
				const embed = new MessageEmbed({
					color: 'GREEN',
					author: {
						name: interaction.user.tag,
						iconURL: interaction.user.displayAvatarURL(),
					},
					footer: {
						text: client?.user?.username + ' • Page (' + Math.floor(0 / 1800) + '/' + (Math.ceil(str.length / 1800) - 1) + ') ',
						iconURL: client?.user?.displayAvatarURL(),
					},
					description: '```js\n' + ss.substr(0, 1800) + '```',
				});
				await interaction.reply({embeds: [embed], ephemeral: true});
				for (let i = 1; i < str.length; i = i + 1800) {
					let ss = str.substr(i, i + 1800);
					const embed = new MessageEmbed({
						color: 'GREEN',
						author: {
							name: interaction.user.tag,
							iconURL: interaction.user.displayAvatarURL(),
						},
						footer: {
							text: client?.user?.username + ' • Page (' + Math.floor(i / 1800) + '/' + (Math.ceil(str.length / 1800) - 1) + ') ',
							iconURL: client?.user?.displayAvatarURL(),
						},
						description: '```js\n' + ss.substr(0, 1800) + '```',
					});
					interaction.followUp({embeds: [embed], ephemeral: true});
				}
			} else {
				str = str.substr(0, 1800);
				if (str === 'undefined') str = 'No output';
				const embed = new MessageEmbed({
					color: 'GREEN',
					author: {
						name: interaction.user.tag,
						iconURL: interaction.user.displayAvatarURL(),
					},
					footer: {
						text: client?.user?.username + ' • Page (' + Math.floor(0 / 1800) + '/' + (Math.ceil(str.length / 1800) - 1) + ') ',
						iconURL: client?.user?.displayAvatarURL(),
					},
					description: '```js\n' + str + '```',
				});
				await interaction.reply({embeds: [embed], ephemeral: true});
			}
		} catch (err: any) {
			const embed = new MessageEmbed({
				color: 'RED',
				author: {
					name: interaction.user.tag,
					iconURL: interaction.user.displayAvatarURL(),
				},
				footer: {
					text: client?.user?.username + ' • Page (' + Math.floor(0 / 1800) + '/' + (Math.ceil(err.length / 1800) - 1) + ') ',
					iconURL: client?.user?.displayAvatarURL(),
				},
				description: '```js\n' + err + '```',
			});
			await interaction.reply({embeds: [embed], ephemeral: true});
		}
	},
	{
		user: {
			dev: true,
		},
	}
);
