import { Client, CommandoMessage, Command } from "discord.js-commando-it";


module.exports = class UptimeCommand extends Command {
  constructor(client : Client) {
    super(client, {
      name: 'uptime',
      aliases: ['alive', 'up'],
      memberName: 'uptime',
      group: 'other',
      description: "Risponde con quanto è stato online il bot."
    });
  }
  run(message : CommandoMessage) {
    var seconds : string = `${(this.client.uptime / 1000) % 60}`,
      minutes : string= `${(this.client.uptime / (1000 * 60)) % 60}`,
      hours : string = `${this.client.uptime / (1000 * 60 * 60) % 24}`;
    // prettier-ignore
    hours = (parseInt(hours) < 10) ? ('0' + hours) : hours;
    // prettier-ignore
    minutes = (parseInt(minutes) < 10) ? ('0' + minutes) : minutes;
    // prettier-ignore
    seconds = (parseInt(seconds) < 10) ? ('0' + seconds) : seconds;
    return message.say(
      `:chart_with_upwards_trend: Sono stato online per **${hours}** ore, **${minutes}** minuti e **${seconds}** secondi!`
    );
  }
};