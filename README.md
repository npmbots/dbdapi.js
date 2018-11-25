# DBD API

[WIP] An API Wrapper for [Discord Bots Development](https://discordbots-dev.tru.io/api)

<div align="center">
    <p>
    <a href="https://npmjs.com/package/dbdapi.js"><img src="https://nodei.co/npm/dbdapi.js.png?downloads=true&stars=false"/></a>
    <br>
    <a href="https://travis-ci.com/DiscordBotsDev/dbdapi.js"><img src="https://travis-ci.com/DiscordBotsDev/dbdapi.js.svg"/></a>
    <a href="https://david-dm.org/DiscordBotsDev/dbdapi.js"><img src="https://david-dm.org/DiscordBotsDev/dbdapi.js/status.svg"/></a>
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
