# DayZ BigBrother
Discord bot built with discord.js to live transmits DayZ servers logs to a Discord channel.

## Usage
```
git clone https://github.com/GrosTon1/dayz-bigbrother && cd dayz-bigbrother
npm i
vim config.json
node bot.js
```
`vim config.json` means you need to edit the config.json files with your bot application's token, the location of your ADM logfile and the target text channel.

### You need :
* NodeJS
* Your own [bot application](https://discordpy.readthedocs.io/en/rewrite/discord.html).

If you're new to NodeJS, I recommend you to check out [pm2](http://pm2.keymetrics.io/) which is a process manager for NodeJS that can restart the bot automatically if it crashes.

#### This work is licensed under CC-BY-NC-SA-4.0.