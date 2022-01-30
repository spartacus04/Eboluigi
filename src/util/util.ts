import dns from 'dns';

export const forEachParallel = async <T>(arr : Array<T>, func: (item : T) => Promise<void>) : Promise<void> => {
	await Promise.all(arr.map(item => func(item)));
};

export const onReconnect = async (callback : () => void) : Promise<void> => {
	new Promise<void>(resolve => {
		dns.resolve('discord.com', (err : Error) => {
			if(err) {
				setTimeout(() => {
					onReconnect(callback).then(resolve);
				}, 5000);
			}
			else {
				callback();
				resolve();
			}
		});
	});
};

export const onDisconnect = async (callback : () => void) : Promise<void> => {
	new Promise<void>(resolve => {
		dns.resolve('discord.com', (err : Error) => {
			if(err) {
				callback();
				resolve();
			}
			else {
				setTimeout(() => {
					onDisconnect(callback).then(resolve);
				}, 5000);
			}
		});
	});
};