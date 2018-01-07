'use strict';

module.exports = (() => {
    class Deletbot {
        constructor () {
            this.deletMode = false;
        }
    
        handleMessage (message) {
            // PMs won't have a message.member property
            if (message.member 
                && message.content === '!delet' 
                && this.deletMode === false) {
                let canManageMessages = message.member.hasPermission('MANAGE_MESSAGES');

                if (canManageMessages) {
                    this.deletMode = true;
                    let currentChannel = message.channel;
                    
                    // recursive function
                    let continuousDelet = () => {
                        if (this.deletMode === true) {
                            return new Promise((resolve, reject) => {
                                currentChannel.fetchMessages()
                                .then(messages => {
                                    let msgArray = messages.array();
                                    let msgsForDeletion = [];

                                    for (let i = 0; i < msgArray.length; i++) {
                                        if (!msgArray[i].pinned) msgsForDeletion.unshift(msgArray[i]);
                                    }
                        
                                    if (msgsForDeletion.length >= 2) {
                                        return currentChannel.bulkDelete(msgsForDeletion, false)
                                    }
                                    else if (msgsForDeletion.length === 1) {
                                        return msgsForDeletion[0].delete();
                                    }
                                    else {
                                        // done, no more
                                        this.deletMode = false;
                                        return Promise.resolve();
                                    }
                                })
                                .then(() => {
                                    // TODO: add a delay or something so we're not throttled by discord API
                                    return continuousDelet();   // will only return a resolved promise once no more messages are available
                                })
                                .then(() => {
                                    return resolve();   // when no more messages are available to delete
                                })
                                .catch(err => {
                                    return reject(err);
                                });
                            });
                        }
                        else {
                            return Promise.resolve();
                        }
                    };

                    // start recursion
                    continuousDelet()
                    .catch(err => {
                        message.channel.send('Error! ' + err.message);
                        this.deletMode = false; // need this reset here too
                    });
                }
                else {
                    message.channel.send(
                        'fuck off you don\'t have permissions to manage messages here.', 
                        { reply: message.author }
                    );
                }
            }
        }
    }
    
    let deletbot = new Deletbot();

    return deletbot;
})();