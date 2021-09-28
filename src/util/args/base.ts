export class type {
	validate(arg : string) : boolean {
		return arg != '';
	}

	parse(arg : string) : unknown {
		return arg;
	}
}