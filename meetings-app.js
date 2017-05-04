var env = require('node-env-file');
var Botkit = require('botkit');
env(__dirname + '/.env');

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.VERIFICATION_TOKEN || !process.env.PORT || !process.env.WEBEX_SITE) {
  console.log('ERROR: Specify CLIENT_ID, CLIENT_SECRET, VERIFICATION_TOKEN, PORT, WEBEX_SITE');
  process.exit(1);
}

var webex_site = process.env.WEBEX_SITE;

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
      res.send('Successfully added botkit-meetings!');
    }
  });
});

controller.on('slash_command', function(slashcom, msg) {
  switch(msg.command) {
    case "/webex" : // handle the '/webex' slash command
      slashcom.replyPrivate(msg,
          "Click the link below to start your meeting:",
          function () {
            slashcom.replyPublicDelayed(msg,
              userLink(msg) + " has scheduled an instant WebEx meeting.\n"
              + "<" + getPmrLink(msg.user_name, webex_site) +"|Click here to join.>"
            );
          });

    break;

    case "/spark" : // handle the '/spark' slash command

    slashcom.replyPrivate(msg,
      "Click the link below to start your meeting:",
        function () {
          slashcom.replyPublicDelayed(msg,
            userLink(msg) + " has started a meeting.\n"
            + "<" + getSparkLink(msg.user_name, webex_site) +"|Click here to join with Spark>"
          );
        });

    break;

    case "/pmr" : // test case for richer '/pmr' slash command

    slashcom.replyPrivate(msg,
      "Click one of the links below to start your meeting:",
        function () {
          slashcom.replyPublicDelayed(msg,
            userLink(msg) + " has started a meeting.\n"
            + "<" + getPmrLink(msg.user_name, webex_site) +"|Click here to join with WebEx>\n"
            + "<" + getSparkLink(msg.user_name, webex_site) +"|Click here to join with Spark>"
          );
        });

    break;

    default:
    slashcom.replyPrivate(msg, "I'm sorry, I don't understand: " + msg.command);
  }
});


// Helper Functions


function userLink (msg) {
  return "<@" + msg.user + "|" + msg.user_name + ">";
}

function getPmrLink (username, pmr_domain) {
  return "https://" + pmr_domain + "/meet/" + username;
}

function getSparkLink (username, pmr_domain) {
  return "ciscospark://pmr?sip=" + username + "@" + pmr_domain + "&url=" + getPmrLink(username, pmr_domain);
}
