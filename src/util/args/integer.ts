import { type } from './base';

export class integerType implements type {
	validate(arg: string): boolean {
		const int = parseInt(arg);
		if(isNaN(int)) return false;
		return true;
	}
	parse(arg: string): number {
		return parseInt(arg);
	}
}