import {Message} from 'discord.js';
import {Event, Bot} from '../utils/class';
import { linkPreview } from '../utils/plugins';

export default new Event('messageCreate', async (client: Bot, message: Message) => {

    if (!message.author.bot && message.content.replace(/discord.com/g,"discordapp.com").includes("discordapp.com/channels/")) linkPreview(message)
});
