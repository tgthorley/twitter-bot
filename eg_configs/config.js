module.exports = {
  query: "...",//topic you want to focus twitter on
  seedAccount: "...", // The account you want to promote
  reply:"...", // What to reply to mentions with
  news:'...', //topic you want to search articles for to generate tweets
  resultType: '...',//What type of tweets are we looking for,
  tags: "...", //What to tag new tweets with
  replyFreq:1,//Chance that you will freply to mentions
  pruneFollowers: 0.25,//Chance that you will block followers that are spam
  pruneFollowing: 1,//Chance that you will unfollow accounts that you current follow that are spam
  reFollow:1, //Chance that you will follow your followers
  seedRetweet:0.75, //Chance that you will retweet anything from the seed account
  followFreq: 0.25 , // Chance that you will follow people tweeting about the topic
  retweetFreq: 0.5, // Chance that you will retweet a tweet about the topic
  favoriteFreq:0.25, //Chance that you will favorite a tweet about the topic
  mingleFreq:0.25,//Chance that you will follow a random person one of your followers is following
  tweetFreq: 0.5,//Chance that you will tweet new content (based on news)
  actionInt: 60*60*1000 //interval between actions in milliseconds
}
