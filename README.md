# discord-clear-channel-bot

Discord bot to clear a channel.

Only works in server channels (not DMs).

# Permissions

Requires the following permissions:

* Read Messages
* Manage Messages
* Read Message History

# Usage

Type the command message:

```
!delet
```

# Behavior

The bot reads a few messages from the message history, then tries to delete them all at once by calling the delete message API individually for each one.

The bot continuously deletes any non-pinned messages in the channel until none are left.

Currently there is no way to stop it other than kicking it out of the channel.

# Known Issues

* Sometimes it gets temporarily stuck. After a few seconds to a minute, it may resume.
    * I was testing this in a channel that had a bugged message that could not be deleted nor pinned. Maybe it'll work with regular messages.

# Todo

* Implement a stop feature.
* Use something that isn't Javascript.

# Changelog

## 1.2.3

Fixed some error messages.

## 1.2.2

* Increased delay.
* Set batch size to 5 to avoid throttling.

## 1.2.1

* Added delay between recursive calls to avoid throttling.

## 1.2.0

* Added ability to delete messages older than 14 days.
* Internally changed from using bulk delete API to individual delete API.

## 1.1.0

* Dockerized maybe???

## 1.0.0

* Initial release
