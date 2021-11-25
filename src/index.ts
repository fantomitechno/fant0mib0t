import {Logger, Bot} from './utils/class';
import { MongConnect } from './utils/databases/Init';

require('dotenv').config();

MongConnect()

export const client = new Bot(
  {
    devs: ['563749920683720709'],
    inDev: true,
  },
  {
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'],
    restTimeOffset: 50,
  }
);

process.on('warning', error => Logger.error(`An error occurred. \n${error.stack}`));
process.on('uncaughtException', error => Logger.error(`An error occurred. \n${error.stack}`));
