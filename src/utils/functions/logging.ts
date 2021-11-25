import {Guild, MessageEmbed} from 'discord.js';

export const sendToModLogs = (guild: Guild | null, content: string, type: string) => {
  let logEmbed = new MessageEmbed({
    title: `New ${type}`,
    description: content,
    hexColor: '#3498db',
  });
  const channel: any = guild?.channels.cache.find(c => (c.name.includes('mod-logs') || c.name.includes('logs-mod')) && c.isText());
  channel?.send(logEmbed);
};
