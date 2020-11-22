const Discord = require('discord.js');

module.exports.getLogChannel = function(guild, data) {
    let channel;

    if(data.guild.logChannel)
        channel = guild.channels.cache.get(data.guild.logChannel);
    else
        channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));

    return channel;
};

module.exports.getUserMention = function(msg, search) {
    let user;

    if(msg.mentions.members.first()) { // @Defected
        user = msg.mentions.members.first();
    } else if(search.includes('#')) { // Defected#0001
        let split = search.split('#');
        let lookup = msg.guild.members.cache.find(u => u.user.username.toLowerCase() == split[0] && u.user.discriminator == split[1]);
        if(lookup) user = lookup;
    } else if(search != '') {
        let lookup = msg.guild.members.cache.find(u => u.user.username.toLowerCase() == search); // Defected
        if(lookup) {
            user = lookup;
        } else {
            let lookup = msg.guild.members.cache.find(u => u.user.username.toLowerCase().startsWith(search)); // Def
            if(lookup) user = lookup;
        }
    }

    return (user) ? user.user : false;
}
