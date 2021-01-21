const Discord = require('discord.js-light');

module.exports = {
    name: 'resetlimit',
    description: 'Reset application limit of an user.',
    usage: 'resetlimit <user>',
    aliases: [],
    permissions: ['ADMINISTRATOR'],
    botPermissions: [],
    nsfw: false,
    cooldown: 0,
    ownerOnly: false
}

module.exports.execute = async(bot, msg, args, data) => {
    let search = args.join(' ').trim().toLowerCase();
    let user = bot.tools.getUserMention(msg, search);

    if(!user) return bot.embeds.cmdError(msg, 'Specify a valid user by mentioning or writing the username.', module.exports);

    let memberDB = await bot.data.getMemberDB(user.id, msg.guild.id);
    memberDB.applyCount = 0;
    memberDB.rejectCount = 0;
    await memberDB.save();

    let embed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .setDescription('Application limit for ' + user.tag + ' has been reset.')
    return msg.channel.send(embed);
}
