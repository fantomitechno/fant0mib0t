import chalk from 'chalk';
import dayjs from 'dayjs';
import {MessageEmbed, WebhookClient} from 'discord.js';
import {inspect} from 'util';
import {client} from '../..';

const colors = {
	red: '#b52825',
	orange: '#e76a1f',
	gold: '#deae17',
	yellow: '#eeee23',
	green: '#3ecc2d',
	teal: '#11cc93',
	blue: '#2582ff',
	indigo: '#524cd9',
	violet: '#7d31cc',
	magenta: '#b154cf',
	pink: '#d070a0',
	brown: '#502f1e',
	black: '#000000',
	grey: '#6e6f77',
	white: '#ffffff',
	default: '#cccccc',
};

const LogType = {
	error: 'red',
	warn: 'yellow',
	info: 'blue',
	event: 'green',
	log: 'default',
	debug: 'white',
	comment: 'gray',
};

type ColorResolvable = NonNullable<keyof typeof colors | keyof typeof LogType | string>;

export class Logger {
	private constructor() {}

	protected static process(text: any, color: ColorResolvable = 'debug', title: string = '') {
		const datePart = `[${dayjs().format('YYYY/MM/DD HH:mm:ss.SSS')}]`;
		const titlePart = `[${title.toUpperCase()}]`;
		text = typeof text === 'string' ? text : inspect(text);

		text = text.replace(/(?<![;\d])\d+(\.\d+)?(?!;|\d)/g, (match: string) => chalk.yellow(match));
		text = text.replace(/\u001b\[\u001b\[33m39\u001b\[39mm/gi, chalk.reset());

		color = propertyInEnum(LogType, color) ?? color;
		text = `${Logger.setColor('#847270', datePart)}${Logger.setColor(color, `${titlePart} ${text + chalk.reset()}`)}`;
		console.log(text);
	}

	public static setColor(color: ColorResolvable = colors.default, text: string = '') {
		let finalColor: chalk.Chalk;
		if ((color = Logger.getColorFromColorResolvable(color))) finalColor = chalk.hex(color);
		else throw new Error('Waiting for a log type, color or HexColor but receive something else.');

		return text ? finalColor(text) : finalColor();
	}

	private static getColorFromColorResolvable(color: ColorResolvable) {
		return (
			propertyInEnum(LogType, propertyInEnum(colors, color) ?? '') ??
			propertyInEnum(colors, color) ??
			propertyInEnum(LogType, color)?.match(/#[0-9|a-f]{6}/i)?.[0] ??
			color.match(/#[0-9|a-f]{6}/i)?.[0] ??
			colors.default.substring(1, 7)
		);
	}

	/**
	 * Log a message in the console as a comment.
	 *
	 * @remarks
	 * Using the grey color.
	 * @param message - The message to log, can be anything.
	 * @param title - The title of the log.
	 */
	public static comment(message: any, title: string = 'comment') {
		Logger.process(message, LogType.comment, title);
	}

	/**
	 * Log a message in the console as an error.
	 *
	 * @remarks
	 * Using the red color.
	 * @param message - The message to log, can be anything.
	 * @param title - The title of the log.
	 */
	public static error(message: any, title: string = 'error') {
		const embed = new MessageEmbed({
			color: 'RED',
			author: {
				name: client.user?.username,
				iconURL: client.user?.displayAvatarURL(),
			},
			footer: {
				text: client?.user?.username,
				iconURL: client?.user?.displayAvatarURL(),
			},
			description: '```js\n' + message + '```',
		});
		const webhook = new WebhookClient({url: process.env.WEBHOOK as string});
		webhook.send({embeds: [embed]});
		Logger.process(message, LogType.error, title);
	}

	/**
	 * Log a message in the console as an event.
	 *
	 * @remarks
	 * Using the green color.
	 * @param message - The message to log, can be anything.
	 * @param title - The title of the log.
	 */
	public static event(message: any, title: string = 'event') {
		Logger.process(message, LogType.event, title);
	}

	/**
	 * Log a message in the console as an info.
	 *
	 * @remarks
	 * Using the blue color.
	 * @param message - The message to log, can be anything.
	 * @param title - The title of the log.
	 */
	public static info(message: any, title: string = 'info') {
		Logger.process(message, LogType.info, title);
	}

	/**
	 * Log a message in the console.
	 *
	 * @remarks
	 * Using the # color.
	 * @param message - The message to log, can be anything.
	 * @param title - The title of the log.
	 * @param color - The color of the log.
	 */
	public static log(message: any, title: string = 'log', color: ColorResolvable = LogType.log) {
		Logger.process(message, color, title);
	}
}

function propertyInEnum<V extends {[k: string]: any}>(enumObject: V, property: string): keyof V | undefined {
	return enumObject[property] ?? undefined;
}
