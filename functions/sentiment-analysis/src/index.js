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
 * `./helpers/events/process-event.spec.js`.
 * Tha schema validates only the required attributes
 * that we are interested in.
 * 
 * It returns a stringified JSON output the strucutre of which is 
 */
exports.handler = async (event) => {
    let processedEvent = await processEvent(event);
    if (processedEvent.status != "ok") {
        console.log("There was an error!", JSON.stringify(processedEvent));
    }
    return JSON.stringify(processedEvent);
};