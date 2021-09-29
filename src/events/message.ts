import {Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed} from 'discord.js';
import {Event, Bot} from '../utils/class/index';

export default new Event('messageCreate', async (client: Bot, message: Message) => {});
