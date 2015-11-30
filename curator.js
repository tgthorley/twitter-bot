//
// Curates content for posting
//
var app_config = require("./app_config"),
    config = require("./config");

var unirest = require('unirest'),
    Bitly = require('bitly'),
    bitly = new Bitly(app_config.bitly.ACCESS_TOKEN);

var Curator = module.exports = {
  //this.twit = new Twit(config);
};

//
//Test Curator
//
Curator.test = function (callback) {
  console.log("testing scheduler")
};

Curator.createTweet = function (callback){
  unirest.get("https://webhose.io/search?token=" + app_config.webhose.searchtoken + "&format=json&q=" + encodeURI(config.news))
  .header("Accept", "text/plain")
  .end(function (result) {
      data = result.body.posts;
      var i = Math.floor(data.length*Math.random());
      var post = data[i];
      var count = 0;
      while ((!post.title || post.title.length < 3) && count < 10)
      {
        if (i++ < data.length){
          i++
        }
        else {
          i --;
        }
        post = data[i];
        count ++;
      }
      bitly.shorten(post.url)
      .then(function(response) {
        var shortUrl = response.data.url;
        var meta =  " " + config.tags + " " + shortUrl;
        var tweet = post.title + meta;
        if (tweet.length < 140){
            //console.log(tweet);
            callback(null,tweet);
        }
        else {
          var short = post.title.substring(0, 136 - meta.length) + "...";
          tweet = short + meta;
          if (tweet.length <= 140){
              //console.log(tweet);
              callback(null,tweet);
          }
            else { console.log("failed to create tweet", meta.length);}
        }
      });
  });
}
