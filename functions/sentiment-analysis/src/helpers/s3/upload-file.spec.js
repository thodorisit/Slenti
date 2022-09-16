const { uploadFile } = require("./upload-file.js");

describe.only("Test case for S3 UploadFile", () => {
    
    // Initialize the s3's information that is provided by localstack. 
    process.env.S3_BUCKET_NAME__ANALYSIS_RESULTS = "slentiv1-analyzed-messages-results";
    process.env.S3_BUCKET_REGION__ANALYSIS_RESULTS = "us-east-1";
    
    let templateObjectData = {
        fileKey: "2022/01/01/message-1.json",
        fileContent: JSON.stringify({
                one: "one1",
                two: 2  
            }),
        bucketName: process.env.S3_BUCKET_NAME__ANALYSIS_RESULTS,
        bucketRegion: process.env.S3_BUCKET_REGION__ANALYSIS_RESULTS,
        awsEndpoint: "http://localhost:4566",
        s3ForcePathStyle: true
    };

    it("should upload file to s3 bucket", async () => {
        let uploadFileToS3Result = await uploadFile(templateObjectData);
        expect(uploadFileToS3Result.status).toEqual("ok");
    });

    it("should return error - The fileKey is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.fileKey = null;
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The fileKey is required and it needs to be a string with length >= 1.");
    });

    it("should return error - General error", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.fileKey = undefined;
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("There was an error. The allowed properties of the object are: fileKey, fileContent, bucketName, bucketRegion, awsEndpoint, s3ForecePathStyle.");
    });

    it("should return error - The fileKey is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.fileKey = "";
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The fileKey is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The fileKey is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.fileKey = false;
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The fileKey is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The fileKey is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.fileKey = 123;
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The fileKey is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The fileKey is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.fileKey = {a:1, b:2};
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The fileKey is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The fileKey is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.fileKey = ["1", 2];
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The fileKey is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The fileContent is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.fileContent = null;
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The fileContent is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The fileContent is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.fileContent = undefined;
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("There was an error. The allowed properties of the object are: fileKey, fileContent, bucketName, bucketRegion, awsEndpoint, s3ForecePathStyle.");
    });

    it("should return error - The fileContent is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.fileContent = "";
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The fileContent is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The fileContent is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.fileContent = false;
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The fileContent is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The fileContent is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.fileContent = 123;
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The fileContent is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The fileContent is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.fileContent = {a:1, b:2};
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The fileContent is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The fileContent is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.fileContent = ["1", 2];
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The fileContent is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The bucketName is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.bucketName = null;
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The bucketName is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The bucketName is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.bucketName = undefined;
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("There was an error. The allowed properties of the object are: fileKey, fileContent, bucketName, bucketRegion, awsEndpoint, s3ForecePathStyle.");
    });

    it("should return error - The bucketName is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.bucketName = "";
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The bucketName is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The bucketName is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.bucketName = false;
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The bucketName is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The bucketName is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.bucketName = 123;
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The bucketName is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The bucketName is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.bucketName = {a:1, b:2};
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The bucketName is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The bucketName is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.bucketName = ["1", 2];
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The bucketName is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The bucketRegion is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.bucketRegion = null;
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The bucketRegion is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The bucketRegion is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.bucketRegion = undefined;
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("There was an error. The allowed properties of the object are: fileKey, fileContent, bucketName, bucketRegion, awsEndpoint, s3ForecePathStyle.");
    });

    it("should return error - The bucketRegion is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.bucketRegion = "";
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The bucketRegion is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The bucketRegion is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.bucketRegion = false;
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The bucketRegion is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The bucketRegion is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.bucketRegion = 123;
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The bucketRegion is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The bucketRegion is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.bucketRegion = {a:1, b:2};
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The bucketRegion is required and it needs to be a string with length >= 1.");
    });

    it("should return error - The bucketRegion is required", async () => {
        let cloneObjectData = JSON.parse(JSON.stringify(templateObjectData));
        cloneObjectData.bucketRegion = ["1", 2];
        let uploadFileToS3Result = await uploadFile(cloneObjectData);
        expect(uploadFileToS3Result.status).toEqual("error");
        expect(uploadFileToS3Result.data).toEqual("The bucketRegion is required and it needs to be a string with length >= 1.");
    });

});