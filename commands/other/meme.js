const { Command } = require('discord.js-commando-it');
const randomPuppy = require('random-puppy');

module.exports = class RandomNumberCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'meme',
      aliases: ['meme', 'cursedimage'],
      memberName: 'meme',
      group: 'other',
      description: 'Invia un Meme'
    });
  }

  run(message) {
    let subreddit = "hmmm";

    message.channel.startTyping();

    randomPuppy(subreddit).then(async url => {
            await message.channel.send({
                files: [{
                    attachment: url,
                    name: 'meme.png'
                }]
            }).then(() => message.channel.stopTyping());
    }).catch(err => console.error(err));
  }
};
