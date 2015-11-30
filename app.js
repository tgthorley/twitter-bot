
var Bot = require("./bot"),
    Sched = require("./scheduler"),
    curator = require("./curator"),
    Gatherer = require("./gatherer"),
    unirest = require('unirest'),
    Bitly = require('bitly');

var app_config = require("./app_config"),
    config = require("./config");

console.log("Running twitter bot for\n", config.query, config.tags, "\n\nStarted At", new Date());
var bot = new Bot(app_config.twitter),
    sched = new Sched (),
    bitly = new Bitly(app_config.bitly.ACCESS_TOKEN);

sched.schedule(bot);
