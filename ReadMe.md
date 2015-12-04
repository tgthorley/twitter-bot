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

These settings essentially describe the bot's behaviour.
### Content and type of tweets
* query: The topic you want to focus twitter on - test this using the search bar in twitter. It should be the same syntax - so you can use AND, OR etc.
* seedAccount: The account you want to promote - another twitter handle.
* reply: If you are mentioned the bot will reply with the users name, this string and then your hash tags
* news:The topic you want to search [Webhose.io](www.webhose.io) for articles - tweets will be generated based on the titles of these articles
* resultType: What type of tweets are we looking for - see twitter API docs for more details
* tags: What hastags do you want to attach to tweets and replys

### Frequency of behaviours
* replyFreq:Chance that you will reply to mentions
* pruneFollowers:Chance that you will test a follower to see if the bot should block them
* pruneFollowing: Chance the you will test someone you follow to see if you should unfollow them
* reFollow: Chance that you will follow your followers
* seedRetweet: Chance that you will retweet anything the seedAccount tweeted
* followFreq:  Chance that you will follow people tweeting about the topic
* retweetFreq: Chance that you will retweet a tweet about the topic
* favoriteFreq: Chance that you will favorite a tweet about the topic
* mingleFreq: Chance that you will follow a random person one of your followers is following
* tweetFreq: Chance that you will tweet based on the new topic above
* actionInt: Interval between actions in milliseconds

## app_config.js
Example for this file is at eg_configs/app_config.js. Copy it to this directory and then:

Log in to [Bitly](bit.ly) go to your account and then go to advanced settings/API Support and copy the API Key into app_config.js in the appropriate place as shown in the example.

Log into [Twitter](www.twitter.com) and go to [apps.twitter.com](https://apps.twitter.com/). Click 'Create New App' and fill in the form as directed. Then click on the 'Keys and Access Tokens' tab. Now you should copy and paste the consumer key and consumer secret into app_config.js. Next scroll to the bottom of the page and click 'Create my access token'. this should generate an access token and access token secret that can be copied into app_config.js

Log in to [Webhose.io](www.webhose.io/dashboard) and copy the active token into search_token in app_config.js as shown in the example.

Installation
=======
* npm install - to install all required node Modules
* npm sync - Creates a copy of the project with your config and app_config in the git repo in preparation for deployment to OpenShift
* npm deploy - pushes the copied project to the "prod/master" remote. Intended to be an OpenShift repo which will trigger a rebuild

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
* DMs
* YouTube for seed content
