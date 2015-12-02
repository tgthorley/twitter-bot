Prerequistes
=======
To get the bot running you need accounts and access tokens for the following services:
* [Bitly](bit.ly)
* [Twitter](www.twitter.com)
* [Webhose.io](www.webhose.io)

Create Config files
=======
## config.js
Example for this file is at eg_configs/config.js

## app_config.js
Example for this file is at eg_configs/app_config.js. Copy it to this directory and then:

Log in to [Bitly](bit.ly) go to your account and then go to advanced settings/API Support and copy the API Key into app_config.js in the appropriate place as shown in the example.

Log into [Twitter](www.twitter.com) and go to [apps.twitter.com](https://apps.twitter.com/). Click 'Create New App' and fill in the form as directed. Then click on the 'Keys and Access Tokens' tab. Now you should copy and paste the consumer key and consumer secret into app_config.js. Next scroll to the bottom of the page and click 'Create my access token'. this should generate an access token and access token secret that can be copied into app_config.js

Log in to [Webhose.io](www.webhose.io/dashboard) and copy the active token into search_token in app_config.js as shown in the example.

Installation
=======
* npm install

Features
=======
* Tweet - new content scrapped from the web
* ReTweet - relevant tweets
* Favorite - relevant tweets
* ReTweet - anything you tweet (currently throttled to 75% of your tweets)
* Reply - if mentions the bot
* Follow people - who are tweeting about relevant content
* Re-follow - anyone who follows the bot (a way to firm up followers)
* Mingle - follow a random person who is following someone who follows the bot
* Prune people the bot is Following - essentially, stop following if someone is tweeting spam
* Block Followers - block accounts that we'd rather not have following the bot (spammers).

TODO
=======
* Lists
* Messages
* seed content
* respond to replies, DMs
* YouTube for seed content
