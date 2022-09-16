const AWS = require("aws-sdk");
const EnvVariables = require("../environment/variables.js");
const Str = require("../general/str.js");

async function addToQueue(
    messageContent,
    slackUserId,
    slackChannelId,
    slackMessageTs,
    slackMessageEventTs
) {
    // Format variables
    messageContent = (Str.isString(messageContent) ? String(messageContent).trim() : null);
    slackUserId = (Str.isString(slackUserId) ? String(slackUserId).trim() : null);
    slackChannelId = (Str.isString(slackChannelId) ? String(slackChannelId).trim() : null);
    slackMessageTs = (Str.isString(slackMessageTs) ? String(slackMessageTs).trim() : null);
    slackMessageEventTs = (Str.isString(slackMessageEventTs) ? String(slackMessageEventTs).trim() : null);

    // Validate variables
    if (Str.isEmpty(messageContent)) {
        return {
            status: "error",
            data: "The format of the message is not valid."
        };
    } else if (Str.isEmpty(slackUserId)) {
        return {
            status: "error",
            data: "The format of the slack user id is not valid."
        };
    } else if (Str.isEmpty(slackChannelId)) {
        return {
            status: "error",
            data: "The format of the slack channel id is not valid."
        };
    } else if (Str.isEmpty(slackMessageTs)) {
        return {
            status: "error",
            data: "The format of the message ts is not valid."
        };
    } else if (Str.isEmpty(slackMessageEventTs)) {
        return {
            status: "error",
            data: "The format of the message event ts is not valid."
        };
    }

    // Compose SQS parameters
    let sqsMessageParams = {
        /**
         * For the time being it is not needed to have a delay
         * given that all the characteristics of the messages are 
         * directly available via the request that is being received
         * from the slackbot. Slack needs some time (few seconds) 
         * until a message is being included in the results of
         * the API.
         */
        //DelaySeconds: 10,
        MessageAttributes: {
            source: {
                DataType: "String",
                StringValue: "Slenti-SlackBot"
            },
            slackUserId: {
                DataType: "String",
                StringValue: slackUserId
            },
            slackChannelId: {
                DataType: "String",
                StringValue: slackChannelId
            },
            slackMessageTs: {
                DataType: "String",
                StringValue: slackMessageTs
            },
            slackMessageEventTs: {
                DataType: "String",
                StringValue: slackMessageEventTs
            }
        },
        MessageBody: messageContent,
        QueueUrl: EnvVariables.getSentimentAnalysisSQSQueue_uri()
    };

    let sqs = new AWS.SQS({
        apiVersion: "2012-11-05",
        region: EnvVariables.getSentimentAnalysisSQSQueue_region()
    });
    
    let addToSqsPromiseResult = await new Promise((resolve, reject) => {
        sqs.sendMessage(sqsMessageParams, function(err, data) {
            if (err) {
                reject({
                    status: "error",
                    data: JSON.stringify(err)
                });
            } else {
                resolve({
                    status: "ok",
                    data: data
                });
            }
        });
    });

    return addToSqsPromiseResult;
}

module.exports = {
    addToQueue
};
