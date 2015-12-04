
var Bot = require("./bot"),
    Sched = require("./scheduler"),
    curator = require("./curator"),
    Gatherer = require("./gatherer"),
    unirest = require('unirest'),
    Bitly = require('bitly');
    express = require("express"),
    morgan = require('morgan'),
    app = express();

var app_config = require("./app_config"),
    config = require("./config");

console.log("Running twitter bot for\n", config.query, config.tags, "\n\nStarted At", new Date());
var bot = new Bot(app_config.twitter),
    sched = new Sched (),
    bitly = new Bitly(app_config.bitly.ACCESS_TOKEN);

sched.schedule(bot);

/*
* basic Webserver to verify running
*/

var portapp = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ipapp = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.listen(portapp,ipapp, function(){
  console.log("\n\nhttp sevrer running on " + ipapp + ":" + portapp+"\n\n");
});
