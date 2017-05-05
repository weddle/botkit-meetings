# botkit-meetings : Spark and WebEx in Slack
This project enables slash commands to join WebEx meetings from inside of Slack.  Meetings can be joined either by WebEx or through the Cisco Spark application.  Currently this is hardcoded for a specific webex site in the .env file and assumes matching usernames between Slack and WebEx.

### Available Slash Commands

* /webex - starts a new meeting in the user’s WebEx PMR
* /spark - starts a new meeting in the user’s PMR with a Spark join link
* /pmr - starts a new meeting in the user’s PMR with both WebEx and Spark join options
