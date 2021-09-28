import { type } from './base';

export class floatType implements type {
	validate(arg: string): boolean {
		const int = parseFloat(arg);
		if(isNaN(int)) return false;
		return true;
	}
	parse(arg: string): number {
		return parseFloat(arg);
	}
}