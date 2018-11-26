# DBD API

An API Wrapper for [Discord Bots Development API](https://discordbots-dev.tru.io/api)

<div align="center">
    <p>
		<a href="https://npmjs.com/package/dbdapi.js"><img src="https://nodei.co/npm/dbdapi.js.png?downloads=true&stars=false"/></a>
		<br>
		<a href="https://travis-ci.com/DiscordBotsDev/dbdapi.js"><img src="https://travis-ci.com/DiscordBotsDev/dbdapi.js.svg"/></a>
		<a href="https://circleci.com/gh/DiscordBotsDev/dbdapi.js"><img src="https://circleci.com/gh/DiscordBotsDev/dbdapi.js.svg?style=svg"/></a>
		<a href="https://david-dm.org/DiscordBotsDev/dbdapi.js"><img src="https://david-dm.org/DiscordBotsDev/dbdapi.js/status.svg"/></a>
	</p>
</div>

# Documentation
WIP :P

## How to install
```bash
npm i dbdapi.js
```

# Examples

## With async/await
```js
const Discord = require('discord.js');
const DiscordBotsDev = require('dbdapi.js');

const bot = new Discord.Client();
const DBD = new DiscordBotsDev('DiscordBots Development API token', "your bot's user id", 'your id / bot owner id', bot);

bot.on('ready', () => console.log("Ready!"));

bot.on('message', async message => {
    var args = message.content.split(" ").replace('.', '');

    if (messsage.content === '.bot') {
        var botData = await DBD.getBot(args[0]);
        if (!botData || botData === undefined) return message.channel.send('Sorry, that bot was not registered *yet* on DiscordBots Developement');
        message.channel.send(`${botData.bot.tag} by ${botData.owner.tag} with prefix ${botData.prefix}!`);
    }
});

bot.login('bot token');
```

## With .then() [Promises]
```js
const Discord = require('discord.js');
const DiscordBotsDev = require('dbdapi.js');

const bot = new Discord.Client();
const DBD = new const DBD = new DiscordBotsDev('DiscordBots Development API token', "your bot's user id", 'your id / bot owner id', bot);

bot.on('ready', () => console.log("Ready!"));

bot.on('message', message => {
    var args = message.content.split(" ").replace('.', '');

    if (messsage.content === '.bot') {
        DBD.getBot(args[0]).then(botData => {
            if (!botData || botData === undefined) return message.channel.send('Sorry, that bot was not registered *yet* on DiscordBots Developement');
            message.channel.send(`${botData.bot.tag} by ${botData.owner.tag} with prefix ${botData.prefix}!`);
        });
    }
});

bot.login('bot token');
```
