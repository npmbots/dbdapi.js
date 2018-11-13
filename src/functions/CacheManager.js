const fs = require('fs');

module.exports = {
    /**
     * Set cache
     * @param {String} name Cache name
     * @param {String} data Cache data
     */
    set: (name, data) => {
        var realData;
        if (typeof data === 'object') realData = JSON.stringify(data);
        else realData = data;
        fs.writeFileSync(`./src/cache/${name}.json`, realData);
    },

     /**
     * Get cache
     * @param {String} name Cache name
     */
    get: (name) => {
        var data;
        var file = fs.readFileSync(`./src/cache/${name}.json`);
        if (typeof file === 'object') data = JSON.parse(file);
        else data = file;
        return data;
    },

    /**
     * Delete cache
     * @param {String} name Cache name
     */
    delete: (name) => {
        fs.unlinkSync(`./src/cache/${name}.json`);
    }
};