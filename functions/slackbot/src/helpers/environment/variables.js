function getSlackSigningSecret() {
    return process.env.SLACK_SIGNING_SECRET;
}

function getSlackBotToken() {
    return process.env.SLACK_BOT_TOKEN;
}

function getSentimentAnalysisSQSQueue_region() {
    return process.env.SENTIMENT_ANALYSIS_SQS_QUEUE__REGION;
}

function getSentimentAnalysisSQSQueue_uri() {
    return process.env.SENTIMENT_ANALYSIS_SQS_QUEUE__URI;
}

function getDebuggingStatus() {
    if (process.env.DEBUGGING_STATUS == "true") {
        return true;
    }
    return false;
}

module.exports = {
    getSlackSigningSecret,
    getSlackBotToken,
    getSentimentAnalysisSQSQueue_region,
    getSentimentAnalysisSQSQueue_uri,
    getDebuggingStatus
};