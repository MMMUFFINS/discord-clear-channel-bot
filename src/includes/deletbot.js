'use strict';

module.exports = (() => {
    class Deletbot {
        constructor () {
            this.deletMode = false;
        }
    
        handleMessage (message) {
            if (message.member && message.content === '!delet') {
                let canManageMessages = message.member.hasPermission('MANAGE_MESSAGES');

                if (canManageMessages) {
                    if (message.content === '!delet' && this.deletMode === false) {
                        this.deletMode = true;
                        let currentChannel = message.channel;
                        
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
                                            .then(msgs => {
                                                return Promise.resolve();
                                            })
                                            .catch(err => {
                                                return Promise.reject();
                                            });
                                        }
                            
                                        else if (msgsForDeletion.length === 1) {
                                            return msgsForDeletion[0].delete()
                                            .then(msg => {
                                                return Promise.resolve();
                                            })
                                            .catch(err => {
                                                return Promise.reject(err);
                                            });
                                        }

                                        else {
                                            // done, no more
                                            this.deletMode = false;
                                            return Promise.resolve();
                                        }
                                    })
                                    .then(() => {
                                        return continuousDelet();   // will only return a resolved promise once 
                                    })
                                    .then(() => {
                                        return resolve();
                                    })
                                    .catch(err => {
                                        return reject(err);
                                    });
                                    
                                })
                            }
                            else {
                                return Promise.resolve();
                            }
                        };

                        // start recursion
                        continuousDelet()
                        .catch(err => {
                            message.channel.send('Error! ' + err.message);
                            this.deletMode = false;
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
        }
    }
    
    let deletbot = new Deletbot();

    return deletbot;
})();


