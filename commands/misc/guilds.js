const Discord = require('discord.js-light');
const fs = require('fs');

module.exports = {
    name: 'guilds',
    description: 'Shows in which guilds is the bot used.',
    usage: 'guilds',
    aliases: ['servers'],
    permissions: [],
    botPermissions: [],
    nsfw: false,
    cooldown: 0,
    ownerOnly: true
}

module.exports.execute = async(bot, msg, args, data) => {
    let description = '';
    bot.guilds.cache.map(g => description += '• ' + g.name + '\n');

    // Embed won't work properly if you have a huge amount of guilds. I'll just dump the list into a file.
    // 
    // let embed = new Discord.MessageEmbed()
    //     .setColor(bot.config.color)
    //     .setTitle('Guilds')
    //     .setDescription(description);
    //  return msg.channel.send(embed);

    fs.writeFile('applybot_guilds.txt', description, (err) => {
        if(err) {
            bot.logger.error('DB error - ' + err);
            return bot.embeds.error(msg, 'Error accessing attachment file.');
        }

        let file = fs.readFileSync('applybot_guilds.txt');
        let attachment = new Discord.MessageAttachment(file, 'list.txt');
        msg.channel.send('List of guilds is attached.', attachment);
    });
};