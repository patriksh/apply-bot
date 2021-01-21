const Discord = require('discord.js-light');

module.exports = {
    name: 'help',
    description: 'List & description of commands.',
    usage: 'help',
    aliases: ['commands'],
    permissions: [],
    botPermissions: [],
    nsfw: false,
    cooldown: 1000,
    ownerOnly: false
}

module.exports.execute = async(bot, msg, args, data) => {
    let prefix = !data.guild.prefix ? bot.config.prefix : data.guild.prefix;
    let embed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .setTitle('Help')
        .addFields(
            { name: 'Applications', value: '`' + prefix + 'apply` - start an application.\n`' + prefix + 'applications <user>` - show all applications by an user.\n`' + prefix + 'accept <user> <note>` - accept an application.\n`' + prefix + 'reject <user> <note>` - reject an application.' },
            { name: 'Configuration', value: '`' + prefix + 'questions` - show application questions.\n`' + prefix + 'addq <question>` - add a question.\n`' + prefix + 'delq <question>` - delete a question.\n`' + prefix + 'delq <question>` - delete a question.\n`' + prefix + 'appchannel <channel>` - set a channel where users apply (type `none` to use any).\n`' + prefix + 'logchannel <channel>` - set a channel where applications are sent (type `none` to use any).\n`' + prefix + 'reviewer <role>` - set application reviewer role (type `none` to allow only admins).\n`' + prefix + 'clearchannel <yes|no>` - clean up application channel automatically.\n`' + prefix + 'applimit <num>` - set how many times users can apply.\n`' + prefix + 'resetlimit <user>` - reset application limit of an user.\n`' + prefix + 'prefix <prefix>` - set a new prefix.' },
            { name: 'Miscellaneous', value: '`' + prefix + 'botstats` - show bot statistics & information.\n`' + prefix + 'ping` - show latency *(useless)*.\n`' + prefix + 'invite` - send bot invite link.\n`' + prefix + 'support` - send invite to bot support server.' },
        );
    
    return msg.channel.send(embed);
}
