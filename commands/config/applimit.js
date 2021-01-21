const Discord = require('discord.js-light');

module.exports = {
    name: 'applimit',
    description: 'Set how many times an user can apply.',
    usage: 'applimit <number>',
    aliases: ['applylimit'],
    permissions: ['ADMINISTRATOR'],
    botPermissions: [],
    nsfw: false,
    cooldown: 0,
    ownerOnly: false
}

module.exports.execute = async(bot, msg, args, data) => {
    let limit = args[0];
    if(!limit?.length) {
        let description = (!data.guild.applyLimit) ? 'Limit isn\'t set up. Users can apply as much times as they want to.' : 'Users can apply up to ' + data.guild.applyLimit + ' times.'
        let embed = new Discord.MessageEmbed()
            .setColor(bot.config.color)
            .setDescription(description)
            .setFooter('Tip: You can reset apply count of an user with <resetlimit <user>.');
        return msg.channel.send(embed);
    }

    let description;
    if(!limit || limit == 'none') {
        limit = 0;
        description = 'Apply limit has been removed. Users can apply as much times as they want to.';
    } else {
        if(!parseInt(limit)) return bot.embeds.cmdError(msg, 'Enter a valid number.', module.exports);
        description = 'Apply limit changed to ' + parseInt(limit) + ' times.';
    }

    data.guild.applyLimit = parseInt(limit);
    await data.guild.save();

    let embed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .setDescription(description)
    return msg.channel.send(embed);
}
