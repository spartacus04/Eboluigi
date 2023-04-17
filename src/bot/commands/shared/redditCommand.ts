import { EmbedBuilder, Message, TextChannel } from 'discord.js';
import { logger } from '@logger';

export const redditCommand = async (message: Message, subreddits: string[]) => {
	try {
		const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

		await (<TextChannel>message.channel).sendTyping();

		const res = await fetch(`https://www.reddit.com/r/${subreddit}.json?sort=top&t=week&limit=800`);
		const data = (await res.json()) as any;
		logger.verbose(data);

		const allowed: any[] = data.data.children.filter((post: any) => !post.data.over_18 && !post.data.stickied && !post.data.is_video);

		if (!allowed.length) {return (<TextChannel>message.channel).send('I meme golosi sono finiti, torna a casa ora');}

		const postData = allowed[Math.floor(Math.random() * allowed.length)].data;

		const embed = new EmbedBuilder()
			.setColor('#00A2E8')
			.setTitle(postData.title)
			.setImage(postData.url)
			.setFooter({ text: `Postato da u/${postData.author} su r/${subreddit} (${postData.ups} upvotes)` });

		await (<TextChannel>message.channel).send({ embeds: [embed] });
	}
	catch (err) {
		logger.error(err);
		await (<TextChannel>message.channel).send('Il meme è gay a quanto pare');
	}
};