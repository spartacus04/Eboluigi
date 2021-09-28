export const forEachParallel = async <T>(arr : Array<T>, func: (item : T) => Promise<void>) : Promise<void> => {
	await Promise.all(arr.map(item => func(item)));
};