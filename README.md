[![Build Status](https://secure.travis-ci.org/ForbesLindesay/waitwake.png?branch=master)](http://travis-ci.org/ForbesLindesay/waitwake)
waitwake
========

WaitWake lets you wait for an event to happen again, even if it has already happened once, then wakes you up

As many functions as you wanted can be added to a channel by name, then you can wake them all up by calling wake on that channel name.

API
---

### wait(name, cb)

Wait on a channel name.  The callback will be called when that channel is woken up.

Returns an object with a cancel method:

#### cancel()

Removes the function from the list of functions waiting for the callback to complete.

### wake(name)

Wake up a channel by name.  This calls all the callbacks that are waiting on that channel and have not been cancelled.

### clean()

If a channel has been emptied by cancelling waits, this will remove it.  It goes through all channels and checks that something's waiting on them.  Then it removes the channel if nothing's waiting for it.