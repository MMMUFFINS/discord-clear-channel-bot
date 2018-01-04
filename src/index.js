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

    if (message.content === '!deletethis') {
        let currentChannel = message.channel;

        currentChannel.fetchMessages()
        .then(messages => {
            return currentChannel.bulkDelete(messages, true);
        })
        .then(deletedMessages => {
            message.channel.send('I deleted everything! Tehe~ :heart:');
        })
        .catch(err => {
            message.channel.send('error! ' + err.message);
        })
    }
    else {
        // message.channel.send('uh huh...');
        return;
    }
    
    
    // send back the message and any associated properties lmao
    // let canManageMessages = message.member.hasPermission('MANAGE_MESSAGES');
    // if (canManageMessages) {
    //     reply = 'You can manage messages!';
    // }
    // else {
    //     reply = 'You can\'t manage messages!';
    // }
    

    

    // message.delete(2000)
    // .then((console.log('deleted message: ' + message.content)))
    // .catch((err) => console.log(err))

    // // reply = message.channel.messages.array();
    // reply = Math.random();

    
});

// program start
client.login(discordToken);