# Functions

There are 2 lambda functions that are responsible for processing and storing the information that has been extracted based on the messages that get posted in the Slack channels where the Slack application has been added to.

## Function: slackbot

This is the lambda function that is getting triggered by the API Gateway which receives requests from the Slack application that has been configured in your Slack workspace. It is responsible for listening to new messages or messages that have been modified and inserting them into an SQS queue.

## Function: sentiment-analysis

This is the lambda function that is getting triggered by the SQS queue which holds the messages that need to be analyzed. It is responsible for performing sentiment analysis and storing the results in the S3 bucket.