const Discord = require('discord.js-light');

module.exports = {
    name: 'logchannel',
    description: 'Set an log channel.',
    usage: 'logchannel <channel>',
    aliases: [],
    permissions: ['ADMINISTRATOR'],
    botPermissions: [],
    nsfw: false,
    cooldown: 0,
    ownerOnly: false
}

module.exports.execute = async(bot, msg, args, data) => {
    let channel, description, footer;
    let search = args.join(' ').trim();

    if(search == '') {
        let description = (data.guild.logChannel !== null) ? 'Current log channel is <#' + data.guild.logChannel + '>.' : 'Log channel is not set up, finished applications will be sent to the first channel I have permissions for.';
        let embed = new Discord.MessageEmbed()
            .setColor(bot.config.color)
            .setDescription(description)
        return msg.channel.send(embed);
    }

    if(msg.mentions.channels.first()) {
        channel = msg.mentions.channels.first();
    } else {
        channel = msg.guild.channels.cache.find(channel => channel.name === search);
    }

    if(search == 'none') {
        description = 'Log channel has been removed. Finished applications will be sent to first channel that I have permissions for.';
    } else {
        if(!channel) return bot.embeds.cmdError(msg, 'Mention a channel, or write it\'s full name.', module.exports);
        if(!channel.permissionsFor(msg.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS']))
            footer = 'Please give me Send Messages and Embed Links permissions.';

        channel = channel.id;
        description = 'Log channel changed to <#' + channel + '>.';
    }

    data.guild.logChannel = channel;
    await data.guild.save();

    let embed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .setDescription(description);
    if(footer) embed.setFooter(footer);

    return msg.channel.send(embed);
}
