function getS3BucketNameAnalysisResults() {
    return process.env.S3_BUCKET_NAME__ANALYSIS_RESULTS;
}

function getS3BucketRegionAnalysisResults() {
    return process.env.S3_BUCKET_REGION__ANALYSIS_RESULTS;
}

function getStoreSlackMessageContentAfterAnalysisStatus() {
    if (process.env.STORE_SLACK_MESSAGES_CONTENT_AFTER_ANALYSIS_STATUS == "true") {
        return true;
    }
    return false;
}

function getDebuggingStatus() {
    if (process.env.DEBUGGING_STATUS == "true") {
        return true;
    }
    return false;
}

module.exports = {
    getS3BucketNameAnalysisResults,
    getS3BucketRegionAnalysisResults,
    getStoreSlackMessageContentAfterAnalysisStatus,
    getDebuggingStatus
};