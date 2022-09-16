const AWS = require("aws-sdk");
const { schema_uploadFile_validate } = require("./upload-file.schemas.js");

/**
 * The schema of the objectParam is available in the
 * `./upload-file.spec.js`.
 */
async function uploadFile(objectParam) {
    const schemaValidation = schema_uploadFile_validate(objectParam);
    if (schemaValidation.status != "ok") {
        return {
            status: "error",
            data: schemaValidation?.data?.formattedErrorList.join(" - ")
        };
    }

    let s3ClientParams = {
        apiVersion: "2006-03-01",
        region: objectParam.bucketRegion
    };

    if (Object.prototype.hasOwnProperty.call(objectParam, "awsEndpoint")) {
        /**
         * For testing purposes (i.e. Localstack).
         */
        s3ClientParams.endpoint = String(objectParam.awsEndpoint);
    }
    if (Object.prototype.hasOwnProperty.call(objectParam, "s3ForcePathStyle")) {
        /**
         * For testing purposes (i.e. Localstack).
         * 
         * Solves the issue connected with localstack during tests:
         * https://github.com/localstack/localstack/issues/3162
         **/ 
        s3ClientParams.s3ForcePathStyle = String(objectParam.s3ForcePathStyle);
    }

    const s3Client = new AWS.S3(s3ClientParams);

    let params = {
        Bucket: objectParam.bucketName,
        Key: objectParam.fileKey, 
        Body: objectParam.fileContent
    };

    let resultObject = await s3Client.upload(params)
        .promise()
        .then(function(data) {
            return {
                status: "ok",
                data: data
            };
        })
        .catch(function(error) {
            return {
                status: "error",
                data: JSON.stringify(error)
            };
        });
    return resultObject;
}

module.exports = {
    uploadFile
};