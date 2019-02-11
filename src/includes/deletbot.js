'use strict';

module.exports = (() => {
    class Deletbot {
        constructor () {
            this.deletMode = false;
        }
    
        HandleMessage (message) {
            // PMs won't have a message.member property
            // during a mass delete, other messages containing the keyword may arrive
            // ignore them if currently purging to avoid duplicate calls to discord
            if (message.member 
                && message.content === '!delet' 
                && this.deletMode === false) {
                let canManageMessages = message.member.hasPermission('MANAGE_MESSAGES');

                if (canManageMessages) {
                    this.deletMode = true;
                    let currentChannel = message.channel;

                    // start recursion
                    this.continuousDelet(currentChannel)
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

        continuousDelet (currentChannel) {
            if (this.deletMode === true) {
                console.log("deleting NOW")
                return new Promise((resolve, reject) => {
                    currentChannel.fetchMessages()
                    .then(messages => {
                        let msgArray = messages.array();
                        console.log("msgArray:")
                        console.log(msgArray)
                        let indivDeletPromises = [];
                        
                        for (let i = 0; i < msgArray.length; i++) {
                            let someMsg = msgArray[i];
                            console.log(someMsg)

                            // ignore pinned messages
                            if (someMsg.pinned) continue;

                            indivDeletPromises.push(
                                someMsg.delete()
                                .catch(err => {
                                    return Promise.reject(new Error("Msg ID " + indivMsg.id + ", " + err.message))
                                })
                            );
                            
                            // ignore messages older than 2 weeks old for now
                        }
            
                        if (indivDeletPromises.length > 0) {
                            console.log("Found some messages to delete")
                            return Promise.all(indivDeletPromises)
                            .catch(err => {
                                console.log("hit an error while individually deleting")
                                return Promise.reject(err);
                            });
                        }
                        else {
                            // done, no more
                            console.log("No more messages in current batch")
                            this.deletMode = false;
                            return Promise.resolve();
                        }
                    })
                    .then(() => {
                        console.log("Finished a batch, calling continuousDelet again")
                        // TODO: add a delay or something so we're not throttled by discord API
                        return this.continuousDelet(currentChannel);   // will only return a resolved promise once no more messages are available
                    })
                    .then(() => {
                        console.log("No more message available to delete")
                        return resolve();   // when no more messages are available to delete
                    })
                    .catch(err => {
                        console.log("We hit an error, cap'n")
                        return reject(err);
                    });
                });
            }
            else {
                return Promise.resolve();
            }
        }

        isBulkDeletable (msg) {
            let now = new Date();
            let daysThreshold = 13 // just to be safe
            let msThreshold = 13 * 24 * 60 * 60 * 1000  // 13 days x 24 hr/day x 60 min/hr x 60 s/min x 1000 ms/s

            return (now - msg.createdAt) < msThreshold;
        }
    }
    
    let deletbot = new Deletbot();

    return deletbot;
})();