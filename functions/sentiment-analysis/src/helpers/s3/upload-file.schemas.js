const Ajv = require("ajv");

const schema_uploadFile = {
    type: "object",
    properties: {
        fileKey: {
            type: "string",
            minLength: 1,
            errorMessage: "The fileKey is required and it needs to be a string with length >= 1."
        },
        fileContent: {
            type: "string",
            minLength: 1,
            errorMessage: "The fileContent is required and it needs to be a string with length >= 1."
        },
        bucketName: {
            type: "string",
            minLength: 1,
            errorMessage: "The bucketName is required and it needs to be a string with length >= 1."
        },
        bucketRegion: {
            type: "string",
            minLength: 1,
            errorMessage: "The bucketRegion is required and it needs to be a string with length >= 1."
        },
        awsEndpoint: {
            type: "string",
            minLength: 1,
            errorMessage: "The awsEndpoint is optional, but if it is passed, it needs to be a string with length >= 1."
        },
        s3ForcePathStyle: {
            type: "boolean",
            errorMessage: "The s3ForcePathStyle is optional, but if it is passed, it needs to be a string with length >= 1."
        }
    },
    required: [
        "fileKey",
        "fileContent",
        "bucketName",
        "bucketRegion"
    ],
    additionalProperties: false,
    errorMessage: {
        type: "There was an error. The allowed properties of the object are: fileKey, fileContent, bucketName, bucketRegion, awsEndpoint, s3ForecePathStyle.",
        _: "There was an error. The allowed properties of the object are: fileKey, fileContent, bucketName, bucketRegion, awsEndpoint, s3ForecePathStyle.",
    },
};

function schema_uploadFile_validate(data) {
    let ajvInstance = new Ajv({
        allErrors: true
    });
    require("ajv-errors")(ajvInstance);
    const validation = ajvInstance.validate(schema_uploadFile, data);
    if (validation === true) {
        return {
            status: "ok",
            data: data
        };
    } else {
        return {
            status: "error",
            data: {
                vanillaErrorList: ajvInstance.errors,
                formattedErrorList: ajvInstance.errors?.map((item) => {
                    return item.message;
                })
            }
        };
    }
}

module.exports = {
    schema_uploadFile_validate
};