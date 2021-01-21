const Discord = require('discord.js-light');
module.exports = async(bot, guild) => {
    try {
        let p = bot.config.prefix;
        let embed = new Discord.MessageEmbed()
            .setColor(bot.config.color)
            .setTitle('ApplyBot is here!')
            .setDescription('<:applybot_ok:753989832652357712> Welcome to ApplyBot v2.\n\nHere are some commands you\'ll need to set me up.')
            .addFields(
                { name: 'Add a question', value: '`' + p + 'addq <text>`' },
                { name: 'Set application channel', value: '`' + p + 'appchannel <channel>` - if application channel is not set, users can apply anywhere.' },
                { name: 'Set log channel', value: '`' + p + 'logchannel <channel>` - if log channel is not set, applications are sent to first text channel I can send messages to.' },
                { name: 'Set reviewer role', value: '`' + p + 'reviewer <role>` - set a reviewer role.' },
                { name: 'See more', value: '`' + p + 'help`' },
            )
            .setFooter('Defected#0001 - www.defected.dev');

        let channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));
        channel.send(embed);
    } catch(err) {
        bot.logger.error('Guild Create event error - ' + err);
    }
}