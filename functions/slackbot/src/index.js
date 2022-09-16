const { App, ExpressReceiver, subtype } = require("@slack/bolt");
const serverlessExpress = require("@vendia/serverless-express");
const EnvVariables = require("./helpers/environment/variables.js");
const { addToQueue } = require("./helpers/sqs/add-to-queue.js");
const Str = require("./helpers/general/str.js");

/**
 * Initialize the express receiver.
 */
const receiver = new ExpressReceiver({
  signingSecret: EnvVariables.getSlackSigningSecret(),
  processBeforeResponse: true
});

const app = new App({
  token: EnvVariables.getSlackBotToken(),
  receiver
});

/**
 * Listen to messages that are getting posted by users
 * in the channels where the bot has been added to.
 */
app.event("message", async ({ event }) => {
  if (!Str.isEmpty(event?.text) && !Str.isEmpty(event?.user)) {
    let insertMessageToQueue = await addToQueue(
        event.text,
        event.user,
        event.channel,
        event.ts,
        event.event_ts
      );
      if (EnvVariables.getDebuggingStatus()) {
        console.log("Message was successfully inserted into the queue.");
        console.log(JSON.stringify(insertMessageToQueue));
      }
  }
});

/**
 * Listen to messages that are getting edited in the channels
 * where the bot has been added to.
 */
app.message(subtype("message_changed"), async ({ event/*, logger*/ }) => {
  if (!Str.isEmpty(event?.message?.text) && !Str.isEmpty(event?.message?.user)) {
    let insertEditedMessageIntoQueue = await addToQueue(
        event?.message?.text,
        event?.message?.user,
        event.channel,
        event.ts,
        event.event_ts
      );
      if (EnvVariables.getDebuggingStatus()) {
        console.log("Edited message was successfully inserted into the queue.");
        console.log(JSON.stringify(insertEditedMessageIntoQueue));
      }
  }
});


/**
 * Health check
 */
receiver.router.get("/my-name-is", async(req, res) => {
  res.status(200).send("slenti");
});

exports.handler = serverlessExpress({
  app: receiver.app
});