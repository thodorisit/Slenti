const AnalyzeMessages = require("../../services/analysis/src/helpers/events/process-event.js");
const { uploadFile: s3UploadFile } = require("../s3/upload-file.js");
const EnvVariables = require("../environment/variables.js");
const { schema_processEvent_validate } = require("./process-event.schemas.js");
const md5 = require("md5");

/**
 * The processEvent is the function that 
 * is responsible for handling the incoming 
 * events from SQS.
 * 
 * This lambda is supposed to get triggered by SQS and
 * consequently the schema of the event matches
 * the SQS event structure.
 * 
 * The `additionalConfiguration` can include
 * some additional attributes such as the 
 * `awsEndpoint` or `s3ForcePathStyle` mainly for
 * testing purposes.
 * 
 * The schema of the event is available in the
 * `./process-event.spec.js`.
 * Tha schema validates only the required attributes
 * that we are interested in.
 */
async function processEvent(event, additionalConfiguration) {
    /**
     * Validate the schema of the event.
     */
    let validateEvent = schema_processEvent_validate(event);
    if (validateEvent.status != "ok") {
        return validateEvent;
    }

    /**
     * Collect all the necessary information in one object for convinient purposes.
     */
    let messageAttributes = {
        messageBody: validateEvent.data.Records[0].body,
        slackChannelId: validateEvent.data.Records[0].messageAttributes.slackChannelId.stringValue,
        slackMessageEventTs: validateEvent.data.Records[0].messageAttributes.slackMessageEventTs.stringValue,
        slackUserId: validateEvent.data.Records[0].messageAttributes.slackUserId.stringValue,
        source: validateEvent.data.Records[0].messageAttributes.source.stringValue,
        slackMessageTs: validateEvent.data.Records[0].messageAttributes.slackMessageTs.stringValue
    };
    
    /**
     * Perform an analysis against the body of the message.
     * 
     * The `data` attribute of the processEvent function when the
     * operation is successful is an array even if a single 
     * phrase is passed.
     */
    let analysisResults = await AnalyzeMessages.processEvent({
        phrases: messageAttributes.messageBody
    });
    if (analysisResults?.status != "ok") {
        return analysisResults;
    }
    let s3UploadProccess = {
        fileContent: null,
        fileKey: 
            new Date(parseInt(String(messageAttributes.slackMessageTs).split(".")[0])*1000).toISOString().split("T")[0].split("-").join("/")
            + "/"
            + md5(Buffer.from([
                    String(messageAttributes.slackChannelId),
                    String(messageAttributes.slackUserId),
                    String(messageAttributes.slackMessageEventTs),
                    String(messageAttributes.slackMessageTs)
                ].join("-")).toString("base64")
            ) + ".txt",
        result: null
    };
    /**
     * Compose the content of the file and store it
     * in the proper S3 bucket.
     */
    s3UploadProccess.fileContent = {
        messageBody: ((EnvVariables.getStoreSlackMessageContentAfterAnalysisStatus()) ? String(messageAttributes.messageBody) : "hidden-for-security-purposes"),
        slackChannelId: String(messageAttributes.slackChannelId),
        slackMessageEventTs: String(messageAttributes.slackMessageEventTs),
        slackUserId: String(messageAttributes.slackUserId),
        slackMessageTs: String(messageAttributes.slackMessageTs),
        classifiedAsLabel: String(analysisResults.data[0].classifiedAs.label),
        classifiedAsProbability: String(analysisResults.data[0].classifiedAs.probability),
        classifiedAsLogLikelihood: String(analysisResults.data[0].classifiedAs.logLikelihood),
        scores: analysisResults.data[0].scores
    };
    let s3UploadParams = {
        fileKey: s3UploadProccess.fileKey,
        fileContent: JSON.stringify(s3UploadProccess.fileContent),
        bucketName: EnvVariables.getS3BucketNameAnalysisResults(),
        bucketRegion: EnvVariables.getS3BucketRegionAnalysisResults(),
    };
    if (additionalConfiguration instanceof Object && additionalConfiguration.constructor === Object) {
        if (Object.prototype.hasOwnProperty.call(additionalConfiguration, "awsEndpoint")) {
            s3UploadParams.awsEndpoint = String(additionalConfiguration.awsEndpoint);
        }
        if (Object.prototype.hasOwnProperty.call(additionalConfiguration, "s3ForcePathStyle")) {
            s3UploadParams.s3ForcePathStyle = !!additionalConfiguration.s3ForcePathStyle;
        }
    }
    s3UploadProccess.result = await s3UploadFile(s3UploadParams);
    if (s3UploadProccess.result.status != "ok") {
        return s3UploadProccess.result;
    }
    return {
        status: "ok",
        data: {
            fileKey: s3UploadProccess.fileKey
        }
    };
}

module.exports = {
    processEvent
};