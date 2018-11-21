# DBD API

[WIP] An API Wrapper for [Discord Bots Development](https://discordbots-dev.tru.io/api)

<div align="center">
    <p>
    <a href="https://npmjs.com/package/discordeco.js"><img src="https://nodei.co/npm/discordeco.js.png?downloads=true&stars=false"/></a>
    <br>
    <a href="https://travis-ci.org/Hazmi35/discoedeco.js"><img src="https://travis-ci.org/Hazmi35/discordeco.js.svg"/></a>
    <a href="https://david-dm.org/Hazmi35/discordeco.js"><img src="https://david-dm.org/Hazmi35/discordeco.js/status.svg"/></a>
    <a href="https://david-dm.org/Hazmi35/discordeco.js?type=dev"><img src="https://david-dm.org/Hazmi35/discordeco.js/dev-status.svg"/></a>
    </p>
</div>

## Documentation
Documentation is still in WIP

## How to install
```bash
npm i dbdapi.js
```

# Examples
```js
const Discord = require('discord.js');
const DiscordBotsDev = require('dbdapi.js');

const bot = new Discord.Client();
const DBD = new DiscordBotsDev('dbd token', bot, 'your id / bot owner id');

bot.on('ready', () => console.log("Ready!"));

bot.on('message', async message => {
    var args = message.content.split(" ");

    if (messsage.content === '.bot') {
        var botData = DBD.getBot(args[1]);
        if (!botData) return message.channel.send("That bot does not registered on Discord Bots Development");
        message.channel.send(`${botData.bot.tag} by ${botData.owner.tag} with prefix ${botData.prefix}.`);
    }
});

bot.login('bot token');
```
