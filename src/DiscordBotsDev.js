const request = require('superagent');
/**
 * DiscordBotsDev Client
 */
module.exports = class DiscordBotsDev {
    /**
     * Create new DiscordBotsDev Wrapper Client
     * @param {String} token DiscordBotsDev token
     * @param {String} clientID Your bot's client id
     * @param {String} ownerID Your ID
     */
    constructor(token, clientID, ownerID) {
        this.baseAPIUrl = 'https://discordbots-dev.tru.io/api';
        //if (!client.user.id) throw new Error('Unsupported Library')
        if (isNaN(clientID)) throw new Error('Invalid bot id');
        if (!ownerID) throw new Error('Invalid client options');
        if (isNaN(ownerID)) return new Error('Invalid client id');
        this.version = require('../package.json').version; //eslint-disable-line
        var loggedInAs = '' //eslint-disable-line

        var userAgent = `dbdapi.js/${this.version}`; //eslint-disable-line

        //Validate Token
        if (token) {
            tokenValidator(token, this.baseAPIUrl, userAgent).then(valid => {
                if (valid === "false") {
                    throw new Error('Invalid DiscordBots Development API Token');
                    //eslint-disable-line
                } else {
                    if (valid === "true") {
                        fetchToken(token, clientID, ownerID, this.baseAPIUrl, userAgent).then(fetchedToken => {
                            //console.log(fetchedToken.ownedBy.bots.filter(bot => bot.id === clientID));
                            console.log(`[DBDAPI] You are logged in as: ${fetchedToken.ownedBy.tag}`);
                            loggedInAs = fetchedToken.ownedBy;
                        });
                    }
                }
            });
        }

        /**
         *  Get any specified bot data using bot id
         * @param {String} ID Bot's user ID
         * @returns {Promise<Object>} A promise that contains data of the bot
         */
        this.getBot = async (ID) => {
            if (!ID || !clientID) throw new Error('[getBot] No ID was Provided.');
            var userID = ID || clientID;
            const response = await request.get(`${this.baseAPIUrl}/bots/${userID}`).set('user-agent', userAgent);
            const bodyRaw = await response.body;
            if (bodyRaw.error === "bot_not_found") return undefined;
            const owner = await fetchUser(bodyRaw.ownerID);
            const botUser = await fetchUser(bodyRaw.botID);
            //if (botUser.bot !== true) return undefined;
            const body = {
                owner: {
                    id: owner.id,
                    username: owner.username,
                    discriminator: owner.discriminator,
                    tag: owner.tag,
                    avatar: owner.avatar,
                    avatarURL: owner.avatarURL,
                    displayAvatarURL: owner.displayAvatarURL,
                    bot: owner.bot,
                    createdAt: new Date(owner.createdTimestamp),
                    createdTimestamp: owner.createdTimestamp,
                    bots: owner.bots
                },
                bot: {
                    id: botUser.id,
                    username: botUser.username,
                    discriminator: botUser.discriminator,
                    tag: botUser.tag,
                    avatar: botUser.avatar,
                    avatarURL: botUser.avatarURL,
                    displayAvatarURL: botUser.displayAvatarURL,
                    bot: botUser.bot,
                    createdAt: new Date(botUser.createdTimestamp),
                    createdTimestamp: botUser.createdTimestamp,
                    ownedBy: botUser.ownedBy
                },
                prefix: bodyRaw.prefix,
                accepted: bodyRaw.accepted,
                claimed: bodyRaw.claimed
            };
            return body;
        };

        /**
         * Fetches User from Discord 
         * @param {String} ID 
         * @returns {Promise<Object>} A Promise that contains user object
         */
        this.fetchUser = async (ID) => {
            if (!ID) throw new Error('[fetchUser] No ID was Provided.');
            const response = await request.get(`${this.baseAPIUrl}/fetchUser?id=${ID}`).set('user-agent', userAgent);
            const body = await response.body;
            var user = null; //eslint-disable-line

            if (body.error === "unknown_user") return undefined;

            user = {
                id: body.id,
                username: body.username,
                discriminator: body.discriminator,
                tag: body.tag,
                avatar: body.avatar,
                avatarURL: body.avatarURL,
                displayAvatarURL: body.displayAvatarURL,
                bot: body.bot,
                createdAt: new Date(body.createdTimestamp),
                createdTimestamp: body.createdTimestamp
            };

            if (user.bot === true || body.bot === true) {
                user.ownedBy = body.ownedBy;
            } else {
                user.bots = body.bots;
            }

            return user;
        };

        /**
         * Posts your bot stats to DiscordBots Dev (serversCount and usersCount)
         * [!IMPORTANT!] This function needs DiscordBotsDev token.
         * @param {String} serversCount Your bot's servers count
         * @param {String} usersCount Your bot's users count
         */
        this.postStats = async (serversCount, usersCount) => { //eslint-disable-line
            return "Still In Development";
        };
    }
};

async function tokenValidator(token, baseAPIUrl, userAgent) { //eslint-disable-line no-unused-vars
    var response = await request.post(baseAPIUrl + '/tokenValidator').send({
        token: token
    }).set('user-agent', userAgent);
    var body = await response.body;
    if (body.isThatTokenValid === false) return "false";
    else return "true";
}

async function fetchToken(token, clientID, ownerID, baseAPIUrl, userAgent) {
    var response = await request.post(baseAPIUrl + '/fetchToken').set('content-type', 'application/json').send({
        token: token
    }).set('user-agent', userAgent);
    var body = await response.body;
    if (body.valid === false) throw new Error('Invalid DiscordBots Development API Token');
    if (body.owned === false) return 'Unknown Token';
    if (body.ownedBy === null) return "Unknown Token";
    //var ownedArrays = new Array();
    //bot.ownedBy
    var returns = {
        valid: body.valid,
        owned: body.owned,
        ownedBy: {
            id: body.ownedBy.id,
            username: body.ownedBy.username,
            discriminator: body.ownedBy.discriminator,
            tag: body.ownedBy.tag,
            avatar: body.ownedBy.avatar,
            avatarURL: body.ownedBy.avatarURL,
            displayAvatarURL: body.ownedBy.displayAvatarURL,
            bot: body.ownedBy.bot,
            createdAt: new Date(body.ownedBy.createdTimestamp),
            createdTimestamp: body.ownedBy.createdTimestamp,
            bots: body.ownedBy.bots
        }
    };

    var bots = [];
    returns.ownedBy.bots.forEach(bot => {
        bots.push(bot.botID);
    });
    //console.log(bots);
    if (!bots.includes(clientID)) {
        var bot = await fetchUser(clientID);
        if (!bot) throw new Error('Invalid clientID');
        if (bot.bot !== true) throw new Error(`The clientID (${clientID}) is not a bot`);
        throw new Error(`You are not owner of this bot (${bot.tag})`);
    }

    var ownerUser = await fetchUser(ownerID);

    if (!ownerUser) throw new Error('Invalid ownerID');

    return returns;
}

async function fetchUser(userID) {
    const version = require('../package.json').version;
    var userAgent = `dbdapi.js/${version}`;
    let {
        body: user
    } = await request.get(`https://discordbots-dev.tru.io/api/fetchUser?id=${userID}`).set('user-agent', userAgent);

    if (user.error === "unknown_user") return undefined;

    var userResolved = null;

    var body = user;

    userResolved = {
        id: body.id,
        username: body.username,
        discriminator: body.discriminator,
        tag: body.tag,
        avatar: body.avatar,
        avatarURL: body.avatarURL,
        displayAvatarURL: body.displayAvatarURL,
        bot: body.bot,
        createdAt: new Date(body.createdTimestamp),
        createdTimestamp: body.createdTimestamp
    };

    if (user.bot === true || body.bot === true) {
        userResolved.ownedBy = body.ownedBy;
    } else {
        userResolved.bots = body.bots;
    }

    return userResolved;
}
