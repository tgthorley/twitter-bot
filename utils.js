var utils = module.exports = {

};

/*
* Generic Error handler
*/
utils.handleError = function (err) {
  console.error("response status:", err.statusCode);
  console.error("data:", err);
};

/*
* returns today's date in a nice format given an estimated timezone
*/
utils.datestring = function () {
  var d = new Date(Date.now() - 5*60*60*1000); //est timezone
  return d.getUTCFullYear() + "-" +
         (d.getUTCMonth() + 1) + "-" +
         d.getDate();
};

utils.dateFormat = function (str) {
  var d = new Date(str.substr(str.indexOf(' ')+1));
   if (d){
     return d;
   }
   else {
     console.log("Didn't create a valid date")
   }
}
/*
* Tests a string of text to see if it just junk or real words
* Returns true if text is junk
* Returns false if text is ok
* Tests for urls, hashtags and usernames
*/
utils.junkText = function (tweet) {
  if (tweet && typeof tweet != "string")
  {
    if (tweet.text)
    {
      tweet = tweet.text;
    }
    else if (tweet.description)
    {
      tweet = tweet.description;
    }
    else {
      tweet = String(tweet);
      console.log(tweet);
    }
  }
  var arr = tweet.split(" ");
  var hashtags = [];
  var urls = [];
  var users =[];
  var realText = [];
  for (i = 0; i < arr.length; i++) {
    var text = String(arr[i]);
      if (text.startsWith("#")){
        hashtags.push(text);
      }
      else if (text.startsWith("http://") || text.startsWith("https://")){
        urls.push(text);
      }
      else if (text.startsWith("@")){
        users.push(text);
      }
      else {
        realText.push(text);
      }
  }
  if (realText.length < 3){
    console.log("Dropped: too little text")
    return true;
  }
  else if (realText.length < hashtags.length){
    console.log("Dropped: too many hashtags")
    return true;
  }
  else if  (realText.length < urls.length){
    console.log("Dropped: too many urls")
    return true;
  }
  else if  (realText.length < users.length){
    console.log("Dropped: too many users")
    return true;
  }
  else {
    return false;
  }
};
/*
* Takes an array and returns a random element from it
*/
utils.randIndex = function (arr) {
  if (arr){
    var index = Math.floor(arr.length*Math.random());
    return arr[index];
  }
  else {this.handleError(new Error('array is undefined', arr));}
};
/*
* Takes an array and returns the index of a random element
*/
utils.randomIndex  = function (arr) {
  var index = Math.floor(arr.length*Math.random());
  return index;
};
