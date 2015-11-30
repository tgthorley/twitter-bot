//
//  Bot
//  class for performing various twitter actions
//
var Twit = require('twit'),
    async = require('async'),
    config = require("./config"),
    utils = require("./utils"),
    curator = require("./curator");

var Bot = module.exports = function(config) {
  this.twit = new Twit(config);
};

Bot.prototype.actions = [
  {name: "Prune Followers", freq: config.pruneFollowers, function: "block"},
  {name: "Prune Following", freq: config.pruneFollowing, function: "prune"},
  {name: "Re-Follow", freq: config.reFollow, function: "refollow"},
  {name: "Follow", freq: config.followFreq, function: "searchFollow"},
  {name: "ReTweet", freq: config.retweetFreq, function: "retweet"},
  {name: "Reply", freq: config.replyFreq, function: "reply"},
  {name: "Seed ReTweet", freq: config.seedRetweet, function: "seedRetweet"},
  {name: "Favorite", freq: config.favoriteFreq, function: "favorite"},
  {name: "Mingle", freq: config.mingleFreq, function: "mingle"},
  {name: "Tweet", freq: config.tweetFreq, function: "tweet"}
];
//
//Update my list of followers
//

Bot.prototype.followers = function (callback) {
  console.log("Updating Followers");
  var followers =[];
  this.twit.get("followers/ids", function(err, reply) {
    if (reply.ids){
      if (reply.next_cursor === 0)
      {
        followers = reply.ids
        console.log("\nFollowers:" + reply.ids.length.toString());
      }
      else
      {
        followers = reply.ids
        //TODO
         console.log("\nmore than " + reply.ids.length.toString() + " Followers \nGetting the rest of them!");
      }
    }
    if(err) return utils.handleError(err)
  });
  return followers;
};

//
//Update the list of people I'm following
//
Bot.prototype.following = function () {
  console.log("Updating Followering");
  var following = [];
  this.twit.get("friends/ids", function(err, reply) {

    if (reply.ids){
      if (reply.next_cursor === 0)
      {
        following = reply.ids
        console.log("\nFollowing:" + reply.ids.length.toString());
      }
      else
      {
        //TODO
        following = reply.ids
        console.log("\nmore than " + reply.ids.length.toString() + " Followers \nGetting the rest of them!");
      }
    }
    if(err) return utils.handleError(err)
    return following;
  });

};

Bot.prototype.searchTweets = function (params,callback) {
  console.log("Searching Tweets");
  var tweets = [];
  this.twit.get('search/tweets', params, function (err, reply) {
    if(err) return callback(err);
    for (var i =0; i < reply.statuses.length; i++)
    {
      if (!utils.junkText(reply.statuses[i].text)){
        tweets.push(reply.statuses[i]);
      }
    }
    console.log("Tweets Available: ", tweets.length);
    return tweets;
  });
};

//
//  post a tweet
//
Bot.prototype.tweet = function (callback) {
  var self = this;
  async.waterfall([
    function (callback) {
      curator.createTweet(function (err, status){
        //console.log(status);
        if (err) {
          callback(new Error("failed creating Tweet:" + err.message));
          console.log("Error");
        }
        else if(typeof status !== 'string') {
          callback(new Error('tweet must be of type String'));
          console.log("Error", status);
        }
        else if(status.length >= 140) {
          callback(new Error('tweet is too long: ' + status.length));
          console.log("Error", status);
        }
        else {
          callback(status);
          console.log("Tweet:", status);
        }
      });
    }
  ], function(status, callback){
    self.twit.post('statuses/update', { status: status }, function(err,res){
      if (err) utils.handleError(err);
    })
  })
};

Bot.prototype.reply = function (callback) {
  var self = this;
  console.log("Replying");
  self.twit.get("statuses/mentions_timeline", function(err, reply) {
    if(err) { return callback(err); }
    for (var i =0; i < reply.length; i++)
    {
      if (new Date() - config.actionInt < utils.dateFormat(reply[i].created_at)){
        if (!junkText(reply[i].text))
        {
          var status = repy[i].user.screen_name + " " + config.reply  + " " + config.tags;
          console.log(status);
          self.twit.post('statuses/update', { status: status }, function(err,res){
            if (err) utils.handleError(err);
          });
        }
      }
    }
  });
};

//
//  choose a random friend of one of your followers, and follow that user
//
Bot.prototype.mingle = function (callback) {
    console.log("Mingling");
  var self = this;
  self.twit.get("followers/ids", function(err, reply) {
      if(err) { return callback(err); }
      var followers = reply.ids,
          randFollower  = utils.randIndex(followers);
      self.twit.get('friends/ids', { user_id: randFollower }, function(err, reply) {
        if(err) { return callback(err); }
        var index = utils.randomIndex(reply.ids);
        var target = reply.ids[index];
        while (reply.ids.indexOf(target) != -1) {
          reply.ids.splice(index,1);
          index = utils.randomIndex(reply.ids);
          target = reply.ids[index];
        }
        self.twit.post('friendships/create', { id: String(target) }, callback);
        console.log("Followed:", target);
      });
  });
};

//
// follow your followers
//
Bot.prototype.refollow = function (callback) {
  var self = this;
  console.log("Refollowing");
  self.twit.get("followers/ids", function(err, followers) {
    self.twit.get("friends/ids", function(err, following) {
      console.log("sRefollowing Followers");
      for (i = 0; i < followers.ids.length; i++) {
        var target = followers.ids[i];
        if (following.ids.indexOf(target) === -1)
        {
            self.twit.post('friendships/create', { id: String(target) }, callback);
        }
        else {
          //console.log ("already following " + target);
        }
      }
    });
  });
};

//
//  prune your followers list; unfollow a friend that hasn't followed you back
//

Bot.prototype.prune = function (callback) {
  console.log("Pruning");
  var self = this;
  self.twit.get("friends/ids", function(err, reply) {
    if (err) console.log(err);
    console.log("Pruning Followers");
    var following = reply.ids,
        target  = utils.randIndex(following);
    self.twit.get("followers/ids", function(err, reply) {
      if(err) { return callback(err); }
      if (reply.ids.indexOf(target) === -1){
        self.twit.get('users/show', { user_id: String(target)}, function(err, follower) {
          if(err) console.log(err);
          console.log("testing:", follower.screen_name );
          if(follower.lang != "en" && follower.lang != "es" )
          {
            self.twit.post('friendships/destroy', { id: String(follower.id) });
          }
          else if(utils.junkText(follower.description)){
            self.twit.post('friendships/destroy', { id: String(follower.id)});
          }
        });
      }
      else {
        console.log ("not pruning one of yor followers: " + target);
      }
    });
  });
};
//
// Block Followers
//
Bot.prototype.block = function (callback) {
  console.log("Pruning");
  var self = this;
  self.twit.get("followers/ids", function(err, reply) {
    if(err) { return callback(err); }
    var target = utils.randIndex(reply.ids);
    console.log(target);
    self.twit.get('users/show', { user_id: String(target)}, function(err, follower) {
      if(err) console.log(err);
      console.log("testing:", follower.screen_name);
      if(follower.lang != "en" && follower.lang !="es")
      {
        self.twit.post('blocks/create',{ id: String(follower.id) }, function(err,res){
          if (err) utils.handleError(err);
        });
      }
      else if(utils.junkText(follower.description)){
        self.twit.post('blocks/create',{ id: String(follower.id) }, function(err,res){
          if (err) utils.handleError(err)
        });
      }
      else {
        console.log ("still allowing one of your followers: " + target);
      }
    });
  });
};

Bot.prototype.searchFollow = function (params,callback) {
  console.log("Searching for Following");
  var self = this;
  self.twit.get("followers/ids", function(err, followers) {
    self.twit.get('search/tweets', params, function (err, tweets) {
      for (i = 0; i < tweets.statuses.length; i++) {
        var target = tweets.statuses[i].user.id_str;
        if (followers.ids.indexOf(target) === -1 && tweets.statuses[i].user.lang === "en")
        {
            if (!utils.junkText(tweets.statuses[i].text)){
              self.twit.post('friendships/create', { id: String(target) }, callback);
            }
            else {
            }
        }
        else {
          console.log ("already following " + target);
        }
      }
    })
  });
};


//
// retweet
//
Bot.prototype.retweet = function (params,callback) {
  console.log("Retweeting");
  var self = this;
  self.twit.get('search/tweets', params, function (err, tweets) {
    var index = utils.randomIndex(tweets.statuses);
    var randomTweet = tweets.statuses[index];
    while (!utils.junkText(randomTweet) && tweets.statues.length >= 1) {
      tweets.statuses.splice(index,1);
      index = utils.randomIndex(tweets.statuses);
      randomTweet = tweets.statuses[index];
    }
    self.twit.post('statuses/retweet/:id', { id: randomTweet.id_str }, callback);
  });
};

Bot.prototype.seedRetweet = function (callback) {
  console.log("Retweeting", config.seedAccount);
  var self = this;
  self.twit.get('users/show', {screen_name: config.seedAccount}, function (err, user) {
    if (err) return utils.handleError(err);
    if (new Date() - config.actionInt < utils.dateFormat(user.status.created_at)){
      self.twit.post('statuses/retweet/:id', { id: user.status.id_str }, callback);
    }
    else {
      console.log("No new tweets since", newDate(user.status.created_at))
    }
  });
};

//
// favorite a tweet
//
Bot.prototype.favorite = function (params, callback) {
  console.log("Favoriting");
  var self = this;
  self.twit.get('search/tweets', params, function (err, tweets) {
    var index = utils.randomIndex(tweets.statuses);
    var randomTweet = tweets.statuses[index];
    while (!utils.junkText(randomTweet) && tweets.statues.length >= 1) {
      tweets.statuses.splice(index,1);
      index = utils.randomIndex(tweets.statuses);
      randomTweet = tweets.statuses[index];
      console.log(tweets.statuses.length, "tweets left");
    }
    console.log(String(randomTweet.text));
    self.twit.post('favorites/create', { id: randomTweet.id_str }, callback);
  });
};

/* Not Currently used
Bot.prototype.getUserDetails = function (id) {
  this.twit.get('user/show', { user_id: id }, function(err, reply) {
      if(err) return callback(err);
      return reply;
  });
}*/
