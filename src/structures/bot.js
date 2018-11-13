/**
 * Bot Class.
 */
module.exports = class Bot {
    /**
     * 
     * @param {Object} data Raw Data. 
     */
    constructor(data) {
        this.owner = '';
        this.bot = '';
        this.prefix = data.prefix;
        this.accepted = data.accepted;
        this.claimed = data.claimed;
    }
};