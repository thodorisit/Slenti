const { addToQueue } = require("./add-to-queue.js");

describe.only("Test case for SQS SendMessage", () => {
    
    // Initialize the queue"s information that is provided by localstack. 
    process.env.SENTIMENT_ANALYSIS_SQS_QUEUE__URI = "http://localhost:4566/000000000000/slenti-message-analysis";
    process.env.SENTIMENT_ANALYSIS_SQS_QUEUE__REGION = "us-east-1";

    // Initialize the queue message attributes values.
    const TEST_QUEUE__messageContent = "test-" + String(Date.now());
    const TEST_QUEUE__slackUserId = "U123456789A";
    const TEST_QUEUE__slackChannelId = "C12345678901";
    const TEST_QUEUE__slackMessageTs = "1000000001.123456";
    const TEST_QUEUE__slackMessageEventTs = "2000000002.654321";

    // Add item to queue.
    it("Add item to queue.", async () => {
        let addToQueueResult = await addToQueue(
            TEST_QUEUE__messageContent,
            TEST_QUEUE__slackUserId,
            TEST_QUEUE__slackChannelId,
            TEST_QUEUE__slackMessageTs,
            TEST_QUEUE__slackMessageEventTs
        );
        expect(addToQueueResult.status).toEqual("ok");
    });

    // Receive/Confirm the previously added item. 
    it("The newly added item can be received.", async () => {
        const AWS = require("aws-sdk");
        const sqs = new AWS.SQS({
            apiVersion: "2012-11-05",
            region: process.env.SENTIMENT_ANALYSIS_SQS_QUEUE__REGION,
            endpoint: new AWS.Endpoint(process.env.SENTIMENT_ANALYSIS_SQS_QUEUE__URI),
        });
        let sqsMessageParams = {
            QueueUrl: process.env.SENTIMENT_ANALYSIS_SQS_QUEUE__URI,
            MaxNumberOfMessages: 1,
            MessageAttributeNames: [
                "source",
                "slackUserId",
                "slackChannelId",
                "slackMessageTs",
                "slackMessageEventTs"
            ]
        };
        let retrieveMessageFromSqsResult = await new Promise((resolve, reject) => {
            sqs.receiveMessage(sqsMessageParams, function(err, data) {
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
        
        // Sleep for 500 ms
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 500);
        });
        expect(retrieveMessageFromSqsResult.data?.Messages?.[0]?.Body).toEqual(TEST_QUEUE__messageContent);
        expect(retrieveMessageFromSqsResult.data?.Messages?.[0]?.MessageAttributes?.source?.StringValue).toEqual("Slenti-SlackBot");
        expect(retrieveMessageFromSqsResult.data?.Messages?.[0]?.MessageAttributes?.slackUserId?.StringValue).toEqual(TEST_QUEUE__slackUserId);
        expect(retrieveMessageFromSqsResult.data?.Messages?.[0]?.MessageAttributes?.slackChannelId?.StringValue).toEqual(TEST_QUEUE__slackChannelId);
        expect(retrieveMessageFromSqsResult.data?.Messages?.[0]?.MessageAttributes?.slackMessageTs?.StringValue).toEqual(TEST_QUEUE__slackMessageTs);
        expect(retrieveMessageFromSqsResult.data?.Messages?.[0]?.MessageAttributes?.slackMessageEventTs?.StringValue).toEqual(TEST_QUEUE__slackMessageEventTs);
        
    });
});