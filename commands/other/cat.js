const { Command } = require('discord.js-commando-it');
const randomPuppy = require('random-puppy');

module.exports = class CatCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'cat',
      aliases: ['cat-pic', 'cats'],
      group: 'other',
      memberName: 'cat',
      description: 'Risponde con un immagine di un gatto',
      throttling: {
        usages: 2,
        duration: 10
      }
    });
  }

  run(message) {
    message.channel.startTyping();

    randomPuppy("dogpictures").then(async url => {
            await message.channel.send({
                files: [{
                    attachment: url,
                    name: 'meme.png'
                }]
            }).then(() => message.channel.stopTyping());
    }).catch(err => console.error(err));
  }
};
