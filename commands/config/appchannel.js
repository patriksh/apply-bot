const Discord = require('discord.js-light');

module.exports = {
    name: 'appchannel',
    description: 'Set an application channel.',
    usage: 'appchannel <channel>',
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
        let description = (data.guild.appChannel !== null) ? 'Current application channel is <#' + data.guild.appChannel + '>.' : 'Application channel is not set up, users can apply in any channel.';
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
        description = 'Application channel has been removed. Users can apply in any channel.';
    } else {
        if(!channel) return bot.embeds.cmdError(msg, 'Mention a channel, or write it\'s full name.', module.exports);
        if(!channel.permissionsFor(msg.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS']))
            footer = 'Please give me Send Messages and Embed Links permissions.';

        channel = channel.id;
        description = 'Application channel changed to <#' + channel + '>.';
    }

    data.guild.appChannel = channel;
    await data.guild.save();

    let embed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .setDescription(description);
    if(footer) embed.setFooter(footer);

    return msg.channel.send(embed);
}
