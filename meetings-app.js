var env = require('node-env-file');
env(__dirname + '/.env');

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.VERIFICATION_TOKEN || !process.env.PORT) {
  console.log('ERROR: Specify CLIENT_ID, CLIENT_SECRET, VERIFICATION_TOKEN, PORT');
  process.exit(1);
}

var Botkit = require('botkit');

var options = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  scopes: ['commands'],
  json_file_store: './db_meetingsapp/'
};

var controller = Botkit.slackbot(options);

controller.setupWebserver(process.env.PORT, function (err, webserver) {
  controller.createWebhookEndpoints(controller.webserver);
  controller.createOauthEndpoints(controller.webserver, function(err,req,res) {
    if (err) {
      res.status(500).send('Error with OAuth : ' + err);
    } else {
      res.send('Success adding botkit-meetings!');
    }
  });
});

controller.on('slash_command', function(slashcom, msg) {
  switch(msg.command) {
    case "/webex" : // handle the '/webex' slash command
      slashcom.replyPublic(msg,
        "<" + getPmrLink(msg.user_name, "go.webex.com") + "|Join " + msg.user_name + "'s PMR with WebEx>");
    break;

    case "/spark" : // handle the '/spark' slash command
      slashcom.replyPublic(msg,
        "<" + getSparkLink(msg.user_name, "go.webex.com") + "|Join " + msg.user_name + "'s PMR with Spark>");
    break;

    case "/pmr" : // test case for richer '/pmr' slash command
      slashcom.replyPublic(msg,
        "<" + getSparkLink(msg.user_name, "go.webex.com") + "|Join " + msg.user_name + "'s PMR with Spark>");
    break;

    default:
    slashcom.replyPublic(msg, "I'm sorry, I don't understand: " + msg.command);
  }
});


// Helper Functions

function getPmrLink (username, pmr_domain) {
  return "https://" + pmr_domain + "/meet/" + username;
}

function getSparkLink (username, pmr_domain) {
  return "ciscospark://pmr?sip=" + username + "@" + pmr_domain + "&url=" + getPmrLink(username, pmr_domain);
}
