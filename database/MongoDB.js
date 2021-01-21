const guildsDB = require('./Schematics/Guild.js');
const membersDB = require('./Schematics/Member.js');
const applicationsDB = require('./Schematics/Application.js');
const questionsDB = require('./Schematics/Question.js');

module.exports.getGuildDB = async function(guildID) {
    let guildDB = await guildsDB.findOne({ id: guildID });
    if(guildDB) {
        return guildDB;
    } else {
        guildDB = new guildsDB({ id: guildID });
        await guildDB.save().catch(err => bot.logger.error('MongoDB guild DB error - ' + err));
        return guildDB;
    }
}

module.exports.getMemberDB = async function(userID, guildID) {
    let memberDB = await membersDB.findOne({ id: userID, guild: guildID });
    if(memberDB) {
        return memberDB;
    } else {
        memberDB = new membersDB({ id: userID, guild: guildID });
        await memberDB.save().catch(err => bot.logger.error('MongoDB member DB error - ' + err));
        return memberDB;
    }
}

module.exports.getGuildSchema = () => guildsDB;
module.exports.getMemberSchema = () => membersDB;
module.exports.getApplicationSchema = () => applicationsDB;
module.exports.getQuestionSchema = () => questionsDB;