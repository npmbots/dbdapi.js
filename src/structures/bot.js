/**
 * Bot Class.
 */
module.exports = class Bot {
    /**
     * 
     * @param {Object} data Raw Data. 
     */
    constructor(data) {
        var owner = null;
        //var bot = null;
        //var ownerUser = getOwnerAndBotUserObject(data.botID, data.ownerID).then(user => owner = user.owner);
        console.log(owner);

        this.owner = owner;
        this.bot = 'none';
        this.prefix = data.prefix;
        this.accepted = data.accepted;
        this.claimed = data.claimed;
    }
};