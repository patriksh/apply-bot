const Discord = require('discord.js-light');

module.exports = {
    name: 'questions',
    description: 'List added questions.',
    usage: 'questions',
    aliases: [],
    permissions: [],
    botPermissions: [],
    nsfw: false,
    cooldown: 1000,
    ownerOnly: false
}

module.exports.execute = async(bot, msg, args, data) => {
    let prefix = !data.guild.prefix ? bot.config.prefix : data.guild.prefix;

    let questionsDB = bot.data.getQuestionSchema();
    let questions = await questionsDB.find({ guild: msg.guild.id }).catch(err => {
        bot.logger.error('DB error - ' + err);
        return bot.embeds.dbError(msg);
    });

    let embed = new Discord.MessageEmbed()
        .setColor(bot.config.color);

    if(!questions.length) {
        embed.setTitle('No questions');
        embed.setFooter('Tip: use ' + prefix + 'addq <text> to add a question.');

        return msg.channel.send(embed);
    }

    let description = '';
    questions.forEach((question, key) => {
        let num = ++key;
        description += '**' + num + ')** ' + question.content + '\n';
    });
    embed.setTitle('Questions (' + questions.length + ')');
    embed.setDescription(description);

    return msg.channel.send(embed);
}
