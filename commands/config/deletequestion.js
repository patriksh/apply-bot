const Discord = require('discord.js-light');
const Num2Emoji = require('number-to-emoji');

module.exports = {
    name: 'deletequestion',
    description: 'Delete a question.',
    usage: 'deletequestion <question>',
    aliases: ['delq'],
    permissions: ['ADMINISTRATOR'],
    botPermissions: [],
    nsfw: false,
    cooldown: 0,
    ownerOnly: false
}

module.exports.execute = async(bot, msg, args, data) => {
    let hasManage = msg.guild.me.permissions.has('MANAGE_MESSAGES');

    let content = args.join(' ').trim();
    if(content == '')
        return bot.embeds.cmdError(msg, 'Question can\'t be empty.', module.exports);

    let questionsDB = bot.data.getQuestionSchema();
    let questions = await questionsDB.find({ content: { $regex: content, $options: 'i' }, guild: msg.guild.id }).limit(10).catch(err => {
        bot.logger.error('DB error - ' + err);
        return bot.embeds.dbError(msg);
    });

    if(!questions.length)
        return bot.embeds.cmdError(msg, 'No questions found for query `' + content + '`.', module.exports);

    if(questions.length > 1) {
        let embed = new Discord.MessageEmbed()
            .setColor(bot.config.color)
            .setTitle('Multiple questions found')
            .setDescription('I found multiple questions for query `' + content + '`.\nPick one to delete by reacting.');

        let embed_questions = '';
        questions.forEach((question, key) => {
            let i = key + 1;
            embed_questions += '**' + i + '**) ' + question.content + '\n';
        });
        embed.addField('Questions', embed_questions);

        msg.channel.send(embed).then(m => {
            if(!hasManage) msg.channel.send('**Tip**: If you give me `Manage Messages` permissions, I\'ll remove the reactions myself.');

            questions.forEach((question, key) => m.react(Num2Emoji.toEmoji(key + 1)));
            let filter = (reaction, user) => user.id == msg.author.id && parseFloat(Num2Emoji.fromEmoji(reaction.emoji.name)) > 0;
            m.awaitReactions(filter, { max: 1, time: 30000 }).then(collected => {
                let num = Num2Emoji.fromEmoji(collected.first().emoji.name);
                let question = questions[num - 1];

                if(question) {
                    questionsDB.deleteOne({ _id: question._id }).then(() => {
                        if(hasManage) m.reactions.removeAll();
                        let embed = new Discord.MessageEmbed()
                            .setColor(bot.config.color)
                            .setTitle('Question deleted')
                            .setDescription('Successfully deleted `' + question.content + '`.');
                        return m.edit(embed);
                    }).catch(err => {
                        bot.logger.error('DB error - ' + err);
                        return bot.embeds.dbError(msg);
                    });
                } else {
                    return bot.embeds.dbError(msg);
                }
            }).catch(() => {
                if(hasManage) m.reactions.removeAll();
                let embed = new Discord.MessageEmbed()
                    .setColor(bot.config.color)
                    .setTitle('Question delete cancelled')
                    .setDescription('No reaction after 30 seconds.');
                return m.edit(embed);
            });
        });
    } else {
        let question = questions[0];
        await questionsDB.deleteOne({ _id: question._id }).catch(err => {
            bot.logger.error('DB error - ' + err);
            return bot.embeds.dbError(msg);
        });

        let embed = new Discord.MessageEmbed()
            .setColor(bot.config.color)
            .setTitle('Question deleted')
            .setDescription('Successfully deleted `' + question.content + '`.');
        return msg.channel.send(embed);
    }
}
