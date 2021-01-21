const Discord = require('discord.js-light');

module.exports = {
    name: 'support',
    description: 'Support server URL.',
    usage: 'support',
    aliases: [],
    permissions: [],
    botPermissions: [],
    nsfw: false,
    cooldown: 1000,
    ownerOnly: false
}

module.exports.execute = async(bot, msg, args, data) => {
    let embed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .setTitle('Support server')
        .setURL('https://discord.gg/jYsmps8Vp6')
        .setDescription('Have suggestions or found bugs? Tell it on my support server:\n\nhttps://discord.gg/jYsmps8Vp6');
    return msg.channel.send(embed);
}