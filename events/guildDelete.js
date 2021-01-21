module.exports = async(bot, guild) => {
    try {
        let guildsDB = bot.data.getGuildSchema();
        let membersDB = bot.data.getMemberSchema();
        let applicationsDB = bot.data.getApplicationSchema();
        let questionsDB = bot.data.getQuestionSchema();

        await applicationsDB.deleteMany({ guild: guild.id }, (err, res) => { });
        await questionsDB.deleteMany({ guild: guild.id }, (err, res) => { });
        await membersDB.deleteMany({ guild: guild.id }, (err, res) => {});
        await guildsDB.deleteMany({ id: guild.id }, (err, res) => { });
    } catch(err) {
        bot.logger.error('Guild Delete event error - ' + err);
    }
}