function getConfiguration(serverlessConfig) {
    /**
     * In the following variable, the list of the allowed 
     * serverless environments/stages will be available. If the selected
     * stage is not present in the list,
     * the `serverless deploy --stage={stage}` command 
     * will fail and it will throw an exception.
     */
    const allowedEnvironments = require("../../.configuration/allowed-environments.json");
    let selectedStage = serverlessConfig.options.stage;
    if (allowedEnvironments.list.indexOf(selectedStage) > -1) {
        return generalConfiguration = require("../../.configuration/env-configuration/" + selectedStage + ".general-configuration.json");
    }
    throw "The valid stages/environments are: " + allowedEnvironments.join(",") + ".";
}

function getServiceName(serverlessConfig) {
    return getConfiguration(serverlessConfig)["INFRASTRUCTURE"]["SERVERLESS"]["SERVICE"]["NAME"];
}

function getRegion(serverlessConfig) {
    return getConfiguration(serverlessConfig)["COMMON"]["AWS_REGION"];
}

function getS3StoreResultsBucketSuffix(serverlessConfig) {
    return getConfiguration(serverlessConfig)["INFRASTRUCTURE"]["SERVERLESS"]["S3"]["STORE_RESULTS_BUCKET"]["SUFFIX"];
}

function getAWSAccountId(serverlessConfig) {
    return getConfiguration(serverlessConfig)["COMMON"]["AWS_ACCOUNT_ID"];
}

function getSentimentAnalysisECRRepositoryNameSuffix(serverlessConfig) {
    return getConfiguration(serverlessConfig)["INFRASTRUCTURE"]["SERVERLESS"]["ECR"]["SENTIMENT_ANALYSIS"]["REPO_NAME_SUFFIX"];
}

function getStoreSlackMessageContentAfterAnalysis(serverlessConfig) {
    return getConfiguration(serverlessConfig)["INFRASTRUCTURE"]["SERVERLESS"]["FUNCTIONS"]["SENTIMENT_ANALYSIS"]["STORE_MESSAGE_CONTENT_AFTER_ANALYSIS"];
}


module.exports = {
    getServiceName,
    getRegion,
    getS3StoreResultsBucketSuffix,
    getAWSAccountId,
    getSentimentAnalysisECRRepositoryNameSuffix,
    getStoreSlackMessageContentAfterAnalysis
}