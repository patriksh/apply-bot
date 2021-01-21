const Discord = require('discord.js-light');

module.exports = {
    name: 'reviewer',
    description: 'Set a reviewer role.',
    usage: 'reviewer <role>',
    aliases: [],
    permissions: ['ADMINISTRATOR'],
    botPermissions: [],
    nsfw: false,
    cooldown: 0,
    ownerOnly: false
}

module.exports.execute = async(bot, msg, args, data) => {
    let role, description;
    let search = args.join(' ').trim();

    if(search == '') {
        let description = (data.guild.reviewer !== null) ? 'Current reviewer role is <@&' + data.guild.reviewer + '>.' : 'Reviewer role is not set up, users with `Administrator` permission can review applications.';
        let embed = new Discord.MessageEmbed()
            .setColor(bot.config.color)
            .setDescription(description)
        return msg.channel.send(embed);
    }

    if(msg.mentions.roles.first()) {
        role = msg.mentions.roles.first();
    } else {
        role = msg.guild.roles.cache.find(role => role.name === search);
    }

    if(search == 'none') {
        description = 'Reviewer role has been removed. Users with `Administrator` permission can review applications.';
    } else {
        if(!role) return bot.embeds.cmdError(msg, 'Mention a role, or write it\'s full name.', module.exports);
        role = role.id;
        description = 'Reviewer role changed to <@&' + role + '>.';
    }

    data.guild.reviewer = role;
    await data.guild.save();

    let embed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .setDescription(description);
    return msg.channel.send(embed);
}
