'use strict';

const Discord = require('discord.js');
const fs = require('fs');

let config = JSON.parse(fs.readFileSync('./config.json'));
let discordToken = config.secrets.discord;

const client = new Discord.Client();
const deletbot = require('./includes/deletbot.js');

client.on('ready', () => {
    console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
    // ignore bots, including itself! THIS IS IMPORTANT
    if (message.author.bot) return;

    deletbot.handleMessage(message);
    // message.member is undefined for PMs

});

// program start
client.login(discordToken);