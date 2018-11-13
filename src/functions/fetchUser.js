const { get } = require('superagent');

/**
* Fetches user from Discord using their id
* @param {String} ID User ID from Discord
* @returns {Promise} A Promise that contains user class.
*/
module.exports = async (ID) => {
     if (!ID) throw new Error('No ID was specified.');
     try {
         var response = await get(`https://discordbots-dev.glitch.me/api/fetchUser?id=${ID}`);
         var data; //eslint-disable-line
     } catch(e) {
         if (e.message === "Not Found") return;
         else throw new Error(e);
     }
     if (response === undefined) return undefined;
     data = await response.body;
     var user = require('../structures/user');
     var realData = new user(data);
     return realData;
};
