/**
 * Bot Class.
 */
module.exports = class Bot {
    /**
     * 
     * @param {Object} data Raw Data. 
     */
    constructor(data) {
        var cache = require("../functions/CacheManager");

        require('../functions/fetchUser')(data.ownerID).then(user => cache.set('owner', JSON.stringify(user)));
        require('../functions/fetchUser')(data.botID).then(user => cache.set('bot', JSON.stringify(user)));

        //console.log(data);
        this.owner = cache.get('owner');
        this.bot = cache.get('bot');
        this.prefix = data.prefix;
        this.accepted = data.accepted;
        this.claimed = data.claimed;

        setTimeout(() => {
            cache.delete('owner');
            cache.delete('bot');
        }, 2000);
    }
};