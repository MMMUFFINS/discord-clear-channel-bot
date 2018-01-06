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

    // message.member is undefined for PMs
    if (message.member) {
        let canManageMessages = message.member.hasPermission('MANAGE_MESSAGES');

        if (message.content === '!delet') {
            if (canManageMessages) {
                let currentChannel = message.channel;
    
                currentChannel.fetchMessages()
                .then(messages => {
                    let msgArray = messages.array();
                    let msgsForDeletion = [];
                    // ignore the first message
                    for (let i = 0; i < msgArray.length; i++) {
                        if (!msgArray[i].pinned) msgsForDeletion.unshift(msgArray[i]);
                    }
    
                    if (msgsForDeletion.length >= 2) {
                        return currentChannel.bulkDelete(msgsForDeletion, false);
                    }
    
                    else {
                        return msgsForDeletion[0].delete();
                    }
                })
                .catch(err => {
                    message.channel.send('error! ' + err.message);
                });
            }
            else {
                message.channel.send(
                    'fuck off you don\'t have permissions to manage messages here.', 
                    {
                        reply: message.author
                    }
                );
            }
        }
    }

});

// program start
client.login(discordToken);