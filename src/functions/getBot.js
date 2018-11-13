const { get } = require("superagent");

/**
*  Get any specified bot data using bot id
* @param {String} ID DiscordBots ID to get the data.
* @returns {Promise} A promise that contains data of the bot
*/
module.exports = async (ID) => {
    //console.log(ID);
    if (!ID) throw new Error('No ID was specified.');
    try {
    var response = await get(`https://discordbots-dev.glitch.me/api/bots/${ID}`);
    var data; //eslint-disable-line no-unused-vars
    } catch (e) {
        if (e.message === 'Not Found') data = {};
        else throw new Error(e);
    }
    if (response === undefined) return undefined;
    else {
    data = response.body;
    }
    var bot = require('../structures/bot.js');
    var realData = new bot(data);
    return realData;  
};