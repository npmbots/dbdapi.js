const request = require('superagent');
/**
 * DiscordBotsDev Client
 */
module.exports = class DiscordBotsDev {
    /**
     * Create new DiscordBotsDev Wrapper Client
     * @param {String} token DiscordBotsDev token
     * @param {String} botID Your bot ID
     * @param {String} ownerID Your ID
     */
    constructor(token, botID, ownerID) {
        //console.log(token, '\n', botID, '\n', ownerID);
        this.baseAPIUrl = 'https://discordbots-dev.tru.io/api';
        if (!botID) throw new Error('Invalid client options');
        if (isNaN(botID)) return new Error('Invalid bot id');
        if (!ownerID) throw new Error('Invalid client options');
        if (isNaN(ownerID)) return new Error('Invalid bot id');
        tokenValidator(token, botID, ownerID, this.baseAPIUrl);

        /**
        *  Get all bots that was registered in DiscordBots Development Database.
        * @returns {Promise} A promise that contains bots.
        */
        this.getAllBots = require('../functions/getAllBots');
        
        /**
        *  Get any specified bot data using bot id
        * @param {String} ID DiscordBots ID to get the data.
        * @returns {Promise} A promise that contains data of the bot
        */
        this.getBot = require('../functions/getBot');


        /**
         * Fetches user from Discord using their id
         * @param {String} ID User ID from Discord
         * @returns {Promise} A Promise that contains user class.
         */
        this.fetchUser = require('../functions/fetchUser');
    }
};

function tokenValidator(token, botID, ownerID, baseAPIUrl) {
    request.post(baseAPIUrl + '/tokenValidator').send({
        token: token
    }).then(res => {
        if (res.body.isThatTokenValid === false) throw new Error("Invalid Token");
        else {
            //console.log(botID);
            fetchToken(token, botID, ownerID, baseAPIUrl);
        }
    });
}

function fetchToken(token, botID, ownerID, baseAPIUrl) {
    request.post(baseAPIUrl + '/fetchToken').send({
        token: token
    }).then(async res => {
        var ownerUser = res.body.ownedBy;
        //console.log(botID);
        try {
        var botDataRaw = await request.get(`${baseAPIUrl}/bots/${botID}`);
        } catch(e) {
            if (e.message === 'Not Found') throw new Error('Your bot was not registered on DiscordBots Dev Database, please invite your bot on DiscordBots Dev Official Server.');
            else throw new Error(e);
        }
        var botData = botDataRaw.body;
        //console.log(botData, typeof botData);
        if (botData.ownerID !== ownerUser.id) throw new Error("You are not owner of this bot.");
        else return 'success';
    });
}