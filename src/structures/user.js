/**
 * User Class.
 */
module.exports = class User {
    /**
     * 
     * @param {Object} data Raw Data. 
     */
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.discriminator = data.discriminator;
        this.tag = data.tag;
        this.avatar = data.avatar;
        this.avatarURL = data.avatarURL;
        this.displayAvatarURL = data.displayAvatarURL;
        this.bot = data.bot;
    }
};