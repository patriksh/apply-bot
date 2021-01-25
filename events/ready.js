module.exports = async(bot) => {
    try {
        bot.user.setPresence({ activity: { name: 'your applications.', type: 'WATCHING' }, status: 'online' });
        bot.logger.ready(bot.user.tag + ' initialized.');
    } catch(err) {
        bot.logger.error('Ready event error - ' + err);
    }
};
