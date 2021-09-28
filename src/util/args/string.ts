import { type } from './base';

export class stringType implements type {
	validate(arg: string): boolean {
		return arg != '';
	}

	parse(arg: string) : string {
		return arg;
	}
}