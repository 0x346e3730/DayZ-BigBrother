const Tail = require('tail').Tail;
const Discord = require('discord.js');
const Constants = require('discord.js/src/util/Constants');
const { TOKEN, LOG_LOCATION, GUILD_ID, CHANNEL_NAME  } = require('./config.json');
const client = new Discord.Client();

let logsQueue = [];
let logBeingTreated = false;

client.once('ready', () => {
    client.user.setActivity('Made with ❤ by GrosTon1');

    const tail = new Tail(LOG_LOCATION, {
        useWatchFile: true
    });

    tail.on("line", (data) => {
        logsQueue.push(getLog(data));
        treatLogs();
    }).on("error", function(error) {
        console.log('ERROR: ', error);
    });
});

client.login(TOKEN);

function getLog(data) {
    const splittedData = data.split('|');

    return {
        'hour': splittedData[0].trim(),
        'data': splittedData[1].trim(),
        'type': getLogType(splittedData[1])
    }
}

function getLogType(data) {
    if (data.includes('hit by') || data.includes('is unconscious') || data.includes('regained consciousness')) {
        return Constants.Colors['ORANGE'];
    } else if (data.includes('killed by') || data.includes('died.') || data.includes('comitted suicide') || data.includes('bled out')) {
        return Constants.Colors['RED']
    }  else if (data.includes('Chat("') || data.includes('PlayerList log')) {
        return Constants.Colors['BLUE'];
    } else if (data.includes('is connected')) {
        return Constants.Colors['DARK_GREEN'];
    } else if (data.includes('has been disconnected')) {
        return Constants.Colors['DARK_RED'];
    } else if (data.includes('[COT]')) {
        return Constants.Colors['DARK_ORANGE'];
    } else if (data.includes('placed')) {
        return Constants.Colors['PURPLE'];
    } else if (data.includes('built') || data.includes('dismantled')) {
        return Constants.Colors['LUMINOUS_VIVID_PINK'];
    } else if (data.includes('PLAYER REPORT')) {
        return Constants.Colors['GOLD'];
    } else {
        return Constants.Colors['BLURPLE'];
    }
}

function treatLogs() {
    if (logBeingTreated || !logsQueue.length) return;

    logBeingTreated = true;
    const log = logsQueue.shift();
    const guild = client.guilds.get(GUILD_ID);
    const channel = guild.channels.find(channel => CHANNEL_NAME === channel.name)
    const messageId = channel.lastMessageID;

    if (messageId) {
        channel.fetchMessage(messageId)
            .then((lastMessage) => {
                if ( lastMessage && lastMessage.embeds && lastMessage.embeds.length && lastMessage.embeds[0].color === log.type && lastMessage.embeds[0].fields && lastMessage.embeds[0].fields.length < 25 ) {
                    editMessage(lastMessage, log);
                } else {
                    sendMessage(channel, log);
                }
            })
            .catch(() => {
                sendMessage(channel, log)
            });
    } else {
        sendMessage(channel, log);
    }
}

function endTreatLog() {
    logBeingTreated = false;
    treatLogs();
}

function sendMessage(channel, log) {
    let embed = new Discord.RichEmbed({
        fields: [{
            name: log.hour,
            value: log.data
        }],
    });
    embed.setColor(log.type);
    channel.send(embed).then(endTreatLog);
}

function editMessage(message, log) {
    let lastEmbed = message.embeds[0];
    lastEmbed = new Discord.RichEmbed({
        fields: lastEmbed.fields.concat([{
            name: log.hour,
            value: log.data
        }])
    });
    lastEmbed.setColor(log.type);
    message.edit(lastEmbed).then(endTreatLog);
}