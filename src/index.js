'use strict';

const Discord = require('discord.js');
const fs = require('fs');

let config = JSON.parse(fs.readFileSync('./config.json'));
let discordToken = config.secrets.discord;

const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
    // ignore bots, including itself! THIS IS IMPORTANT
    if (message.author.bot) return;
    
    let reply;
    // send back the message and any associated properties lmao
    let canManageMessages = message.member.hasPermission('MANAGE_MESSAGES');
    if (canManageMessages) {
        reply = 'You can manage messages!';
    }
    else {
        reply = 'You can\'t manage messages!';
    }
    console.log(reply);
    message.channel.send(reply);
});

// program start
client.login(discordToken);