import {Message} from 'discord.js';
import {Event, Bot} from '../utils/class/index';
import { linkPreview } from '../utils/plugins/linkPreview';

export default new Event('messageCreate', async (client: Bot, message: Message) => {

    if (!message.author.bot && message.content.replace(/discord.com/g,"discordapp.com").includes("discordapp.com/channels/")) linkPreview(message)
});
