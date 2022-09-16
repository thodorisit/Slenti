const { processEvent } = require("./helpers/events/process-event.js");

/**
 * The processEvent is the module that 
 * is responsible for handling the incoming 
 * events from SQS.
 * 
 * This lambda is supposed to get triggered by SQS and
 * consequently the schema of the event matches
 * the SQS event structure.
 * 
 * The schema of the event is available in the
 * `./helpers/events/process-event.schemas.js`.
 * Tha schema validates only the required attributes
 * that we are interested in.
 * 
 * It returns a stringified JSON output the structure of which is:
 * {
 *      status: "ok" || "error",
 *      data: {
 *          fileKey: {string} // The key of the object stored in S3.
 *      }
 * }
 * 
 * Considering that missing a message is not a deal breaker,
 * there's no dead letter queue configured for the messages that fail to be
 * analyzed. If there's an error, a log is being created.
 * For easily processing the errors, you can either throw an exception
 * and configure a dead letter queue or process and identity the error logs
 * created in the CloudWatch log groups by using subscription filters.
 * An example related to the latter option can be found below:
 * https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Subscriptions.html 
 */
exports.handler = async (event) => {
    let processedEvent = await processEvent(event);
    if (processedEvent.status != "ok") {
        console.log("There was an error!", JSON.stringify(processedEvent));
    }
    return JSON.stringify(processedEvent);
};