//
// Schedules Activities
//
var config = require("./config");
var utils = require("./utils");

var params = {
    q: config.query,
    since: utils.datestring(),
    result_type: config.resultType
};

var Sched = module.exports = function() {
};

//
//Test Scheduler
//
Sched.prototype.test = function (callback) {
  console.log("testing scheduler")
};


Sched.prototype.plan = function(bot){
  //Things to do
  var work = [];
  for (var i =0; i < bot.actions.length; i++){
    var action = bot.actions[i]
    if (action.freq === 1){
      work.push(action.function);
      //console.log('Will '+ action.name)
    }
    else if (Math.random() <= action.freq){
      work.push(action.function);
    }
    else {
      //console.log('Not planning to ' + action.name + ' this time')
    }
  }
  return work;
};

Sched.prototype.excutePlan = function (work, bot){
  var callback = function(err, reply) {
    if(err) return utils.handleError(err);
    return reply;
  };

  for (var i=0; i < work.length; i++)
  {
    if (work[i] === "refollow"){
      bot.refollow(callback);
    }
    else if (work[i] === "prune"){
      bot.prune(callback);
    }
    else if (work[i] === "block"){
      bot.block(callback);
    }
    else if (work[i] === "searchFollow"){
      bot.searchFollow(params, callback);
    }
    else if (work[i] === "retweet"){
      bot.retweet(params, callback);
    }
    else if (work[i] === "seedRetweet"){
      bot.seedRetweet(callback);
    }
    else if (work[i] === "favorite"){
      bot.favorite(params, callback);
    }
    else if (work[i] === "mingle"){
      bot.mingle(callback);
    }
    else if (work[i] === "tweet"){
      bot.tweet(callback);
    }
    else if (work[i] === "reply"){
      bot.reply(callback);
    }
    else if (work[i] === "seedFollow"){
      bot.seedFollow(callback);
    }
    else if (work[i] === "seedFollower"){
      bot.seedFollower(callback);
    }
    else {
      console.log('\nAction not found: ', work[i])
    }
  }
  return false;
};

Sched.prototype.schedule = function (bot){
  var self = this;
  var sched = function() {
    console.log ("\nActions at: ", new Date());
    self.excutePlan(self.plan(bot),bot)
  }
  sched();
  setInterval(sched,config.actionInt);
};
