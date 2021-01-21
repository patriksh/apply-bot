const Discord = require('discord.js-light');

module.exports = {
    name: 'clearchannel',
    description: 'Clear application channel messages.',
    usage: 'clearchannel <yes|no>',
    aliases: ['clear'],
    permissions: ['ADMINISTRATOR'],
    botPermissions: [],
    nsfw: false,
    cooldown: 0,
    ownerOnly: false
}

module.exports.execute = async(bot, msg, args, data) => {
    let prefix = !data.guild.prefix ? bot.config.prefix : data.guild.prefix;

    let clear = args[0];
    if(!clear?.length) {
        let description = (data.guild.clearChannel) ? 'enabled' : 'disabled';
        let embed = new Discord.MessageEmbed()
            .setColor(bot.config.color)
            .setDescription('Application channel clearing is ' + description + '.');
        return msg.channel.send(embed);
    }

    clear = clear.trim();
    if(clear == 'yes' || clear == 'true' || clear == '1') {
        clear = true;
    } else if(clear == 'no' || clear == 'false' || clear == '0') {
        clear = false;
    } else {
        return bot.embeds.cmdError(msg, 'Enter a valid argument.', module.exports);
    }

    data.guild.clearChannel = clear;
    await data.guild.save();

    let description = (clear) ? 'enabled' : 'disabled';
    let embed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .setDescription('Application channel clearing is now ' + description + '.');
    if(clear && !msg.guild.me.permissions.has('MANAGE_MESSAGES')) embed.setFooter('Tip: Give me Manage Messages permissions so I can delete ' + prefix + 'apply messages as well.');

    return msg.channel.send(embed);
}
