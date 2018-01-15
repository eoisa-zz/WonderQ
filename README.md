**WonderQ**

In order to run this  you need to first run the app.js file. This file will start the api.
From there you can code against it or you can run the demo.js file, which will go through the three main endpoints.

The main thing to know about the WonderQ api is that the /write endpoint takes the headers _'id'_ and _'host'_, which are
important because they identify the person who has sent a message and where that person sent it from. The data has been
architected to be any valid json.

In the future I would like to add a filter endpoint so that we can see specific subsets of messages (i.e. who sent 
messages, how many messages are currently consumed, etc.)

I would also like a more robust consensus algorithm so that I am not simply taking the longest chain and ignoring the
rest. I still need to learn how to properly do callbacks, so one of the requirements I set for myself (no acknowledgement sent from 
consumer will reset the status of the messages to zero) has not been completed yet.