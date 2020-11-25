const Discord = require('discord.js');

module.exports = {
    name: 'applications',
    description: 'Get all applications of an user.',
    usage: 'applications <user>',
    aliases: ['apps'],
    permissions: [],
    botPermissions: [],
    nsfw: false,
    cooldown: 0,
    ownerOnly: false
}

module.exports.execute = async(bot, msg, args, data) => {
    // TODO: validate reviewer role

    let search = args.join(' ').trim().toLowerCase();
    let user = bot.tools.getUserMention(msg, search);

    if(!user) return bot.embeds.cmdError(msg, 'Specify a valid user by mentioning or writing the username.', module.exports);

    let applicationsDB = bot.data.getApplicationSchema();
    let applications = await applicationsDB.find({ user: user.id, guild: msg.guild.id }, null, { sort: { date: -1 } }).catch(err => {
        bot.logger.error('MongoDB server DB error - ' + err);
        return bot.embeds.dbError(msg);
    });

    if(!applications.length) {
        let embed = new Discord.MessageEmbed()
            .setColor(bot.config.color)
            .setDescription('No applications found for user ' + user.tag + '.');
        return msg.channel.send(embed);
    }

    applications.forEach(application => {
        let embed = new Discord.MessageEmbed()
            .setColor(bot.config.color)
            .setAuthor(user.tag, user.displayAvatarURL())
            .setFooter('Status: ' + bot.tools.getStatusString(application.status))
            .setTimestamp(application.date);
        application.answers.map(a => embed.addField(a.question, a.answer, true));
        return msg.channel.send(embed);
    });
}
