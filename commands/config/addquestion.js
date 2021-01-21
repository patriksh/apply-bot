const Discord = require('discord.js-light');

module.exports = {
    name: 'addquestion',
    description: 'Add a question.',
    usage: 'addquestion <text>',
    aliases: ['addq'],
    permissions: ['ADMINISTRATOR'],
    botPermissions: [],
    nsfw: false,
    cooldown: 0,
    ownerOnly: false
}

module.exports.execute = async(bot, msg, args, data) => {
    let content = args.join(' ').trim();
    if(content == '')
        return bot.embeds.cmdError(msg, 'Question text can\'t be empty.', module.exports);
    if(content.length > 250)
        return bot.embeds.cmdError(msg, 'Keep it under 250 characters. Your question is ' + content.length + ' characters long.', module.exports);

    let questionsDB = bot.data.getQuestionSchema();
    let question = { guild: msg.guild.id, content: content };
    let questionDB = new questionsDB(question);
    await questionDB.save().catch(err => {
        bot.logger.error('DB error - ' + err);
        return bot.embeds.dbError(msg);
    });

    let amount = await questionsDB.count({ guild: msg.guild.id });
    let embed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .setTitle('Question added')
        .setDescription('`' + content + '`')
        .setFooter('Amount of questions: ' + amount);

    return msg.channel.send(embed);
}
