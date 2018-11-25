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
     * @param {String} client Your bot's client object
     */
    constructor(token, clientID, ownerID, client) {
        this.baseAPIUrl = 'https://discordbots-dev.tru.io/api';
        if (!client) throw new Error('Invalid client options');
        //if (!client.user.id) throw new Error('Unsupported Library')
        if (isNaN(clientID)) throw new Error('Invalid bot id');
        if (!ownerID) throw new Error('Invalid client options');
        if (isNaN(ownerID)) return new Error('Invalid client id');
        this.version = require('../package.json').version; //eslint-disable-line
        var loggedInAs = '' //eslint-disable-line

        //Validate Token
        if (token) {
            tokenValidator(token, this.baseAPIUrl, this.version).then(valid => {
                if (valid === "false") {
                    throw new Error('Invalid DiscordBots Development API Token');
                    return; //eslint-disable-line
                } else {
                    if (valid === "true") {
                        fetchToken(token, client, ownerID, this.baseAPIUrl, this.version).then(fetchedToken => {
                            console.log(`You are logged in as : ${fetchedToken.ownedBy.tag}`);
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
            if (!ID || !client) throw new Error('[getBot] No ID was Provided.');
            var userID = ID || client.user.id;
            const response = await request.get(`${this.baseAPIUrl}/api/bots/${userID}`).set('user-agent', `dbdapi.js/${this.version}`);
            const bodyRaw = await response.body;
            if (bodyRaw.error === "bot_not_found") return undefined;
            const owner = await fetchUser(bodyRaw.ownerID);
            const botUser = await fetchUser(bodyRaw.botID);
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
            const response = await request.get(`${this.baseAPIUrl}/api/fetchUser?id=${ID}`).set('user-agent', `dbdapi.js/${this.version}`);
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
                bot: body.bot
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

async function tokenValidator(token, baseAPIUrl, version) { //eslint-disable-line no-unused-vars
    var response = await request.post(baseAPIUrl + '/tokenValidator').send({
        token: token
    }).set('user-agent', `dbdapi.js/${version}`);
    var body = await response.body;
    if (body.isThatTokenValid === false) return "false";
    else return "true";
}

async function fetchToken(token, client, ownerID, baseAPIUrl, version) {
    var response = await request.post(baseAPIUrl + '/fetchToken').send({
        token: token
    }).send('user-agent', `dbdapi.js/${version}`);
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
            bots: body.ownedBy.bots
        }
    };
    return returns;
}

async function fetchUser(userID) {
    const version = require('../package.json').version;
    let {
        body: user
    } = await request.get(`https://discordbots-dev.tru.io/api/fetchUser?id=${userID}`).set('user-agent', `dbdapi.js/${version}`);

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
        bot: body.bot
    };

    if (user.bot === true || body.bot === true) {
        userResolved.ownedBy = body.ownedBy;
    } else {
        userResolved.bots = body.bots;
    }

    return userResolved;
}