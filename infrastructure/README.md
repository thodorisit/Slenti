# Infrastructure

There are 2 different parts and each of them is being used for totally different purposes.

## Infrastructure: localstack

The infrastructure that is defined via Localstack is used so as to successfully pass the tests that have been defined for the lambda functions. Due to the nature of the lambda functions, they are supposed to call different AWS services such as SQS and S3. In order to emulate those services and pass the tests, we are using `localstack`. More information about this is available [here (link)](https://localstack.cloud/).

If you want to run the tests locally, you have to run the AWS services on your machine via docker by running the following command:
```
docker-compose -f docker-compose.yml up -d
```

The scripts that are available in the `startup-scripts/` folder are responsible for creating the required AWS resources and preparing the testing environment. **No real AWS services are being used for testing purposes.** These scripts are also getting run by the GitHub pipeline since the tests are running when the deployment process takes place.

## Infrastructure: Serverless

The infrastructure that is defined using the Serverless framework is being used in order to deploy the AWS resources in your AWS account.

The resources are:
- Lambda:
    - Functions:
        - `slackbot`
        - `sentiment-analysis`
    - Layers:
        - `slackbot` - The production dependencies (without the `devDependencies`).
        - `sentiment-analysis` - The production dependencies (without the `devDependencies`).
- IAM:
    - Roles:
        - `slackbot` - The role that the `slackbot` lambda function needs in order to be to send messages to the SQS queue.
        - `sentiment-analysis` - The role that the `sentiment-analysis` lambda function needs in order to receive messages from the SQS queue and store the results in the S3 bucket.
- SQS:
    - `messagesToBeAnalyzedQueue` - The queue where the `slackbot` lambda function inserts the messages it receives. This queue triggers the `sentiment-analysis` lambda function that is responsible for performing sentiment analysis and storing the results.
- S3:
    - `storeResultsS3Bucket` - The S3 bucket were the `sentiment-analysis` lambda stores the results when it processes the messages.