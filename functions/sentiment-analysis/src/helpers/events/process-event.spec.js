const { processEvent } = require("./process-event.js");

describe.only("Test case for event process", () => {
    
    // Initialize the information that is provided by localstack for the s3. 
    process.env.S3_BUCKET_NAME__ANALYSIS_RESULTS = "slentiv1-analyzed-messages-results";
    process.env.S3_BUCKET_REGION__ANALYSIS_RESULTS = "us-east-1";
    process.env.STORE_SLACK_MESSAGES_CONTENT_AFTER_ANALYSIS_STATUS = "true";
    
    let templateEventData = {
        "Records": [
            {
                "messageId": "168dd329-bc4f-4f8a-bdbe-683917aa1e23",
                "receiptHandle": "WW91IHRob3VnaHQgdGhhdCB5b3UgZm91bmQgc29tZXRoaW5nIGltcG9ydGFudCwgcmlnaHQ/",
                "body": "Last night I had the wildest dream…and you were there!",
                "attributes": {
                    "ApproximateReceiveCount": "1",
                    "SentTimestamp": "1641042000000",
                    "SenderId": "RANDOMHGJGARF39R:a-random-sender-id",
                    "ApproximateFirstReceiveTimestamp": "1641042000000"
                },
                "messageAttributes": {
                    "slackChannelId": {
                        "stringValue": "C01ABRANDOM",
                        "stringListValues": [],
                        "binaryListValues": [],
                        "dataType": "String"
                    },
                    "slackMessageEventTs": {
                        "stringValue": "1641042000.123456",
                        "stringListValues": [],
                        "binaryListValues": [],
                        "dataType": "String"
                    },
                    "slackUserId": {
                        "stringValue": "U01ABRANDOM",
                        "stringListValues": [],
                        "binaryListValues": [],
                        "dataType": "String"
                    },
                    "source": {
                        "stringValue": "Slenti-SlackBot",
                        "stringListValues": [],
                        "binaryListValues": [],
                        "dataType": "String"
                    },
                    "slackMessageTs": {
                        "stringValue": "1641042000.123456",
                        "stringListValues": [],
                        "binaryListValues": [],
                        "dataType": "String"
                    }
                },
                "md5OfMessageAttributes": "gi3opjib85RANDOMgi3opjib85RANDOM",
                "md5OfBody": "gi3opjib85RANDOMgi3opjib85RANDOM",
                "eventSource": "aws:sqs",
                "eventSourceARN": "arn:aws:sqs:us-east-1:012345678901:SlentiMessageAnalysis",
                "awsRegion": "us-east-1"
            }
        ]
    };

    it("should run successfully", async () => {
        let processEvenResult = await processEvent(
            templateEventData,
            {
                awsEndpoint: "http://localhost:4566",
                s3ForcePathStyle: true
            }
        );
        expect(processEvenResult.status).toEqual("ok");
    });

    it("should run successfully - updated slackMessageEventTs", async () => {
        let cloneEventData = JSON.parse(JSON.stringify(templateEventData));
        cloneEventData.Records[0].messageAttributes.slackMessageEventTs.stringValue = String(Math.random() * (100000000000 - 999999999999) + 100000000000);
        let processEvenResult = await processEvent(
            cloneEventData,
            {
                awsEndpoint: "http://localhost:4566",
                s3ForcePathStyle: true
            }
        );
        expect(processEvenResult.status).toEqual("ok");
    });

    it("should trigger an error - body", async () => {
        let cloneEventData = JSON.parse(JSON.stringify(templateEventData));
        cloneEventData.Records[0].body = parseInt(Math.random() * (100000000000 - 999999999999) + 100000000000);
        let processEvenResult = await processEvent(
            cloneEventData,
            {
                awsEndpoint: "http://localhost:4566",
                s3ForcePathStyle: true
            }
        );
        expect(processEvenResult.status).toEqual("error");
        expect(processEvenResult.data.formattedErrorList).toEqual(["The body of the message is required."]);
    });

    it("should trigger an error - slackChannelId", async () => {
        let cloneEventData = JSON.parse(JSON.stringify(templateEventData));
        cloneEventData.Records[0].messageAttributes.slackChannelId.stringValue = parseInt(Math.random() * (100000000000 - 999999999999) + 100000000000);
        let processEvenResult = await processEvent(
            cloneEventData,
            {
                awsEndpoint: "http://localhost:4566",
                s3ForcePathStyle: true
            }
        );
        expect(processEvenResult.status).toEqual("error");
        expect(processEvenResult.data.formattedErrorList).toEqual(["The slackChannelId is required."]);
    });

    it("should trigger an error - slackMessageEventTs", async () => {
        let cloneEventData = JSON.parse(JSON.stringify(templateEventData));
        cloneEventData.Records[0].messageAttributes.slackMessageEventTs.stringValue = parseInt(Math.random() * (100000000000 - 999999999999) + 100000000000);
        let processEvenResult = await processEvent(
            cloneEventData,
            {
                awsEndpoint: "http://localhost:4566",
                s3ForcePathStyle: true
            }
        );
        expect(processEvenResult.status).toEqual("error");
        expect(processEvenResult.data.formattedErrorList).toEqual(["The slackMessageEventTs is required."]);
    });

    it("should trigger an error - slackUserId", async () => {
        let cloneEventData = JSON.parse(JSON.stringify(templateEventData));
        cloneEventData.Records[0].messageAttributes.slackUserId.stringValue = parseInt(Math.random() * (100000000000 - 999999999999) + 100000000000);
        let processEvenResult = await processEvent(
            cloneEventData,
            {
                awsEndpoint: "http://localhost:4566",
                s3ForcePathStyle: true
            }
        );
        expect(processEvenResult.status).toEqual("error");
        expect(processEvenResult.data.formattedErrorList).toEqual(["The slackUserId is required."]);
    });

    it("should trigger an error - slackMessageTs", async () => {
        let cloneEventData = JSON.parse(JSON.stringify(templateEventData));
        cloneEventData.Records[0].messageAttributes.slackMessageTs.stringValue = parseInt(Math.random() * (100000000000 - 999999999999) + 100000000000);
        let processEvenResult = await processEvent(
            cloneEventData,
            {
                awsEndpoint: "http://localhost:4566",
                s3ForcePathStyle: true
            }
        );
        expect(processEvenResult.status).toEqual("error");
        expect(processEvenResult.data.formattedErrorList).toEqual(["The slackMessageTs is required."]);
    });

});