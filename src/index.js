'use strict';

const Discord = require('discord.js');
const fs = require('fs');
const node_pkg = require('./package.json');

let config = JSON.parse(fs.readFileSync('./config.json'));
let discordToken = config.secrets.discord;

const client = new Discord.Client();
const deletbot = require('./includes/deletbot.js');

client.on('ready', () => {
    console.log('deletbot v', node_pkg.version, 'am ready!');
    client.user.setPresence({
        game: {
            name: '!delet'
        }
    });
});

// Create an event listener for messages
client.on('message', message => {
    // ignore bots, including itself! THIS IS IMPORTANT
    if (message.author.bot) return;

    deletbot.HandleMessage(message);
});

client.on('error', err => {
    console.error(err);
})

// program start
client.login(discordToken);