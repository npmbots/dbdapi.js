const { get } = require('superagent');

/**
 *  Get all bots that was registered in DiscordBots Development Database.
 * @returns {Promise} A promise that contains bots.
 */
module.exports = () => {
    return get('https://discordbots-dev.tru.io/api/bots/').then(res => res.body);
};