const Discord = require('discord.js-light');

module.exports = {
    name: 'announce',
    description: 'Send an announcement to all server log channels.',
    usage: 'announce <message>',
    aliases: ['latency'],
    permissions: [],
    botPermissions: [],
    nsfw: false,
    cooldown: 0,
    ownerOnly: true
}

module.exports.execute = async(bot, msg, args, data) => {
    let success = 0;
    bot.guilds.cache.forEach(guild => {
        let db = bot.data.getGuildDB(guild.id);
        let id = (db.logChannel) ? db.logChannel : guild.channels.cache.find(c => c.type === 'text' && c.permissionsFor(guild.me).has('SEND_MESSAGES')).id;
        
        if(id) {
            let channel = bot.channels.cache.get(id);
            if(channel) {
                let embed = new Discord.MessageEmbed()
                    .setColor(bot.config.color)
                    .setTitle('ApplyBot news')
                    .setDescription(args.join(' '));

                if(channel.send(embed)) success++;
            }
        }
    });

    let embed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .setTitle('ApplyBot news')
        .setDescription(args.join(' '))
        .setFooter('Sent to ' + success + ' guilds.');

    return msg.channel.send(embed);
}
