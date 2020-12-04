const { MessageEmbed } = require('discord.js');
const { newsAPI } = require('../../config.json');
const { Command } = require('../../discord.js-commando/src');
const fetch = require('node-fetch');

module.exports = class YnetNewsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ynet-news',
      aliases: ['israel-news', 'ynet'],
      group: 'other',
      memberName: 'ynet-news',
      description: 'Risponde con le ultime news di Israele',
      throttling: {
        usages: 2,
        duration: 10
      }
    });
  }

  async run(message) {
    message.channel.send({
      files: [{
          attachment: "https://www.dropbox.com/s/4o4tndtc7uwxov0/ynet.jpg?dl=1",
          name: 'diego.png'
      }]
    })
  }
};
