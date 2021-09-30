import {PresenceData, TextChannel} from 'discord.js';
import {Command, Event, Bot, Logger} from '../utils/class/index';
import {presence} from '../utils/JSON/config.json';

export default new Event('ready', async (client: Bot) => {
	const guilds = [
		client.guilds.cache.get(`697788133609046058`), //This is my testing guild
		client.guilds.cache.get(`820619530744365056`)
	];
	Logger.log(`${client.user?.username} launched in ${Date.now() - client.launchedAt}ms !`);

	Logger.info('Commands', 'SETUP');
	client.user?.setPresence({
		status: 'dnd',
		activities: [
			{
				name: 'Loading...',
				type: 'PLAYING',
			},
		],
	});

	if (client.inDev) {
		for (const guild of guilds) {
			await guild?.commands.set(client.commands.filter(c => c instanceof Command).map(c => (c as Command).data)).catch(_ => _);
			for (const cmd of client.commands.filter(c => c instanceof Command && (c.permission?.user?.dev ?? false)).map(m => (m as Command).data.name)) {
				guild?.commands.cache
					.find(c => c.name === cmd)
					?.permissions.add({
						permissions: [
							{
								id: '563749920683720709', //Fantomitechno
								type: 'USER',
								permission: true,
							},
						],
					})
					.catch(_ => _);
			}
		}
	} else {
		await client.application?.commands.set(client.commands.filter(c => c instanceof Command).map(c => (c as Command).data));
		for (const cmd of client.commands.filter(c => c instanceof Command && (c.permission?.user?.dev ?? false)).map(m => (m as Command).data.name)) {
			for (const guild of client.guilds.cache.map(g => g.id)) {
				client.application?.commands.cache
					.find(c => c.name === cmd)
					?.permissions.add({
						permissions: [
							{
								id: '563749920683720709', //Fantomitechno
								type: 'USER',
								permission: true,
							},
						],
						guild: guild,
					})
					.catch(_ => _);
			}
		}
	}
	Logger.info('Cache', 'SETUP');
	for (const guild of client.guilds.cache.map(m => m)) {
		await guild?.members.fetch();
	}
	Logger.info('Done', 'SETUP');
	let status = presence.list[0] as PresenceData;
	client.user?.setPresence(status);
	let i = 1;
	setInterval(() => {
		status = presence.list[i] as PresenceData;
		client.user?.setPresence(status);
		i++;
		if (i === presence.list.length) i = 0;
	}, presence.time);

	const verify = client.inDev ? '829407613204299797' : '829741063941521488';
	(client.channels.cache.get(verify) as TextChannel).messages.fetch();
});
