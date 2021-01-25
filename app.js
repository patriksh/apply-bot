/* includes */
const Discord = require('discord.js-light');
const fs = require('fs');
const util = require('util');
const mongoose = require('mongoose');
const DBL = require('dblapi.js');

/* defines & config */
const bot = new Discord.Client({
    cacheGuilds: true,
    cacheChannels: true,
    cacheOverwrites: false,
    cacheRoles: true,
    cacheEmojis: false,
    cachePresences: false,
    disabledEvents: ['messageDeleteBulk', 'channelCreate', 'channelUpdate', 'channelPinsUpdate', 'roleCreate', 'roleUpdate', 'inviteCreate', 'inviteDelete', 'guildBanAdd', 'guildBanRemove', 'guildMemberAdd', 'guildMemberUpdate', 'guildMemberRemove', 'guildIntegrationsUpdate', 'presenceUpdate', 'typingStart', 'userUpdate', 'voiceStateUpdate', 'webhookUpdate']
});
const readdir = util.promisify(fs.readdir);

bot.events = new Discord.Collection();
bot.commands = new Discord.Collection();
bot.data = require('./database/MongoDB.js');
bot.embeds = require('./helpers/embeds.js');
bot.logger = require('./helpers/logger.js');
bot.tools = require('./helpers/tools.js');
bot.config = require('./config.json');

const dbl = new DBL(bot.config.DBL, bot);

async function initialize() {
    // load events
    let events = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
    for(let e of events) {
        let eventFile = require('./events/' + e);
        let eventName = e.split('.')[0];
        bot.logger.event(eventName + ' loaded.');
        bot.on(eventName, eventFile.bind(null, bot));
    }

    // load commands
    let categories = await readdir('./commands/');
    categories.forEach(c => {
        let commands = fs.readdirSync('./commands/' + c + '/').filter(file => (file.endsWith('.js')));
        for(const file of commands) {
            let commandFile = require('./commands/' + c + '/' + file);
            bot.commands.set(commandFile.name, commandFile);
        }
        bot.logger.cmd(c + ' - ' + commands.length + ' commands loaded.');
    });

    // init database
    mongoose.connect(bot.config.mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        bot.logger.log('MongoDB connected.');
    }).catch((err) => {
        bot.logger.error('MongoDB error - ' + err);
    });

    // login bot
    bot.login(bot.config.token)
}

initialize();
