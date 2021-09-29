import {Bot} from './Bot';

type RunFunction = (...options: any[]) => Promise<any> | void;

export class Event {
	name: string;

	run: RunFunction;

	constructor(name: string, run: RunFunction = (client: Bot) => {}) {
		this.name = name;
		this.run = run;
	}
}
