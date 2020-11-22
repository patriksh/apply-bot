const Discord = require('discord.js');

module.exports.getLogChannel = function(guild, data) {
    let channel;

    if(data.guild.logChannel)
        channel = guild.channels.cache.get(data.guild.logChannel);
    else
        channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));

    return channel;
};
