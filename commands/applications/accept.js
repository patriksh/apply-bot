const Discord = require('discord.js-light');

module.exports = {
    name: 'accept',
    description: 'Accept an application.',
    usage: 'accept <user> <note>',
    aliases: [],
    permissions: [],
    botPermissions: [],
    nsfw: false,
    cooldown: 1000,
    ownerOnly: false
}

module.exports.execute = async(bot, msg, args, data) => {
    if(!bot.tools.isReviewer(msg, data)) {
        let embed = new Discord.MessageEmbed()
            .setColor(bot.config.color)
            .setDescription('Only users with ' + bot.tools.reviewerName(msg, data) + ' are allowed to review applications.');
        return msg.channel.send(embed);
    }

    await msg.guild.members.fetch(); // monitor resource usage... find better solution?

    let search = args.join(' ').trim().toLowerCase();
    let user = bot.tools.getUserMention(msg, search);

    if(!user) return bot.embeds.cmdError(msg, 'Specify a valid user by mentioning or writing the username.', module.exports);

    let applicationsDB = bot.data.getApplicationSchema();
    let applications = await applicationsDB.find({ user: user.id, guild: msg.guild.id, status: 1 }, null, { sort: { date: -1 } }).catch(err => {
        bot.logger.error('DB error - ' + err);
        return bot.embeds.dbError(msg);
    });

    if(!applications.length) {
        let embed = new Discord.MessageEmbed()
            .setColor(bot.config.color)
            .setDescription('No pending applications found for user ' + user.tag + '.');
        return msg.channel.send(embed);
    }

    await applicationsDB.updateMany({ user: user.id, guild: msg.guild.id, status: 1 }, {'$set': { status: 2 }});

    let reason = args.slice(1).join(' ').trim();
    let embedDMDescription = 'Your application for ' + msg.guild.name + ' was accepted.';
    if(reason != '') embedDMDescription += '\nMessage from the server: ' + reason;

    let embedDM = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .setTitle('Application accepted')
        .setDescription(embedDMDescription);
    user.send(embedDM);

    let embed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .setTitle('User accepted')
        .setDescription(user.tag + ' was accepted.')
        .setTimestamp();
    msg.channel.send(embed);

    msg.reply('do you want to give a role to the accepted user? Mention it or write it\'s name.');

    let err = 'No roles will be given to <@' + user.id + '>.';
    let filter = m => m.author.id === msg.author.id;

    msg.channel.awaitMessages(filter, { max: 1, time: 15000 }).then((m) => {
        let content = m.first().content;
        if(content.toLowerCase() == 'no' || content.toLowerCase() == 'nah') {
            msg.channel.send(err);
        } else {
            let role = undefined;
            if(content.includes('<@&')) {
                let id = content.replace(/\D/g,'');
                if(!id.length) return false;
                role = msg.guild.roles.cache.get(id);
            } else {
                role = msg.guild.roles.cache.find(r => r.name === content.trim());
            }
            if(role === undefined) {
                msg.channel.send(err);
            } else {
                let member = msg.guild.members.cache.find(m => m.id === user.id);
                member.roles.add(role).then(() => {
                    msg.channel.send('Role `' + role.name + '` has been given to <@' + user.id + '>.');
                }).catch(() => {
                    msg.channel.send('Well this is awkward. I do not have permissions to give that role to others.');
                });
            }
        }
    });
}
