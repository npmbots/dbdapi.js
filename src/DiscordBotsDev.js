const request = require('superagent');
/**
 * DiscordBotsDev Client
 */
module.exports = class DiscordBotsDev {
    /**
     * Create new DiscordBotsDev Wrapper Client
     * @param {String} token DiscordBotsDev token
     * @param {String} client Your bot's client object
     * @param {String} ownerID Your ID
     */
    constructor(token, client, ownerID) {
        this.baseAPIUrl = 'https://discordbots-dev.tru.io/api';
        if (!client) throw new Error('Invalid client options');
        //if (!client.user.id) throw new Error('Unsupported Library')
        if (isNaN(client.user.id)) throw new Error('Invalid bot id');
        if (!ownerID) throw new Error('Invalid client options');
        if (isNaN(ownerID)) return new Error('Invalid bot id');
        if (token) {
            tokenValidator(token, client.user.id, ownerID, this.baseAPIUrl);
        } else console.warn("No DiscordBotsDev Token was provided");

        /**
         *  Get any specified bot data using bot id
         * @param {String} ID Bot's user ID
         * @returns {Promise<Object>} A promise that contains data of the bot
         */
        this.getBot = async (ID) => {
            if (!ID || !client) throw new Error('[getBot] No ID was Provided.');
            var userID = ID || client.user.id;
            const response = await request.get(`https://discordbots-dev.tru.io/api/bots/${userID}`);
            const bodyRaw = await response.body;
            if (bodyRaw.error === "bot_not_found") return undefined;
            const owner = await fetchUser(bodyRaw.ownerID);
            const botUser = await fetchUser(bodyRaw.botID);
            const body = {
                owner: owner,
                bot: botUser,
                prefix: bodyRaw.prefix,
                accepted: bodyRaw.accepted,
                claimed: bodyRaw.claimed
            };
            return body;
        };

        /**
         * Fetches User from Discord 
         * @param {String} ID 
         * @returns {Promise<Object>}
         */
        this.fetchUser = async (ID) => {
            if (!ID) throw new Error('[fetchUser] No ID was Provided.');
            const response = await request.get(`https://discordbots-dev.tru.io/api/fetchUser?id=${ID}`);
            const body = await response.body;

            if (body.error === "unknown_user") return undefined;
            else return body;
        };

        /**
         * Posts your bot stats to DiscordBots Dev (serversCount and usersCount)
         * @param {String} serversCount Your bot servers count
         * @param {String} usersCount Your bot users count
         */
        this.postStats = async (serversCount, usersCount) => { //eslint-disable-line
            return "Still In Development";
        };
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
            var botDataRaw = await request.get(`${baseAPIUrl}/bots/${botID}`); //eslint-disable-line
        } catch (e) {
            if (e.message === 'Not Found') throw new Error('Your bot was not registered on DiscordBots Dev Database, please invite your bot on DiscordBots Dev Official Server.');
            else throw new Error(e);
        }
        var botData = botDataRaw.body;
        if (botData.error === "bot_not_found") throw new Error('Your bot was not registered on DiscordBots Dev Database, please invite your bot on DiscordBots Development Official Server.');
        //console.log(botData, typeof botData);
        if (botData.ownerID !== ownerUser.id) throw new Error("You are not owner of this bot.");
        else return 'success';
    });
}

async function fetchUser(userID) {
    let { body: user } = await request.get(`https://discordbots-dev.tru.io/api/fetchUser?id=${userID}`);

    return user;
}