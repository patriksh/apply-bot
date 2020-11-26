const Discord = require('discord.js');

module.exports = {
    name: 'reject',
    description: 'Reject an application.',
    usage: 'reject <user> <reason>',
    aliases: [],
    permissions: [],
    botPermissions: [],
    nsfw: false,
    cooldown: 1000,
    ownerOnly: false
}

module.exports.execute = async(bot, msg, args, data) => {
    // TODO: validate reviewer role
    let prefix = !data.guild.prefix ? bot.config.prefix : data.guild.prefix;

    let search = args.join(' ').trim().toLowerCase();
    let user = bot.tools.getUserMention(msg, search);

    if(!user) return bot.embeds.cmdError(msg, 'Specify a valid user by mentioning or writing the username.', module.exports);

    let applicationsDB = bot.data.getApplicationSchema();
    let applications = await applicationsDB.find({ user: user.id, guild: msg.guild.id, status: 1 }, null, { sort: { date: -1 } }).catch(err => {
        bot.logger.error('MongoDB server DB error - ' + err);
        return bot.embeds.dbError(msg);
    });

    if(!applications.length) {
        let embed = new Discord.MessageEmbed()
            .setColor(bot.config.color)
            .setDescription('No pending applications found for user ' + user.tag + '.');
        return msg.channel.send(embed);
    }

    await applicationsDB.updateMany({ user: user.id, guild: msg.guild.id, status: 1 }, {'$set': { status: 3 }});

    let reason = args.slice(1).join(' ').trim();
    let embedDMDescription = 'Your application for ' + msg.guild.name + ' was rejected.';
    if(reason != '') embedDMDescription += '\nMessage from the server: ' + reason;

    let embedDM = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .setTitle('Application rejected')
        .setDescription(embedDMDescription);
    user.send(embedDM);

    let embed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .setTitle('User rejected')
        .setDescription(user.tag + ' was rejected.')
        .setTimestamp();
    msg.channel.send(embed);
}