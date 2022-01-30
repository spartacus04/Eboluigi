export class pError extends Error {
	prettyPrint : boolean;

	constructor(message: string) {
		super(message);
		this.prettyPrint = true;
	}
}