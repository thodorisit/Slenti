![Slenti logo](./.assets/slenti-logo.png)

# Welcome to Slenti!

Slenti is a ready-to-be-deployed solution for performing sentiment analysis in your slack channels. It's not just another Slackbot. It's an event-driven solution running on AWS which means that sky is the limit in terms of seamless scalability. The sentiment analysis is being performed using a Naive Bayes classifier that has been trained with the [GoEmotions (link)](https://ai.googleblog.com/2021/10/goemotions-dataset-for-fine-grained.html) dataset. All rights of the dataset belong to the respective owner. This version of Slenti supports only English. Generally speaking, feel free to clone this repo and make it meet your requirements by even modyfing the core functionalities such as the logic of the sentiment analysis itself. Do you want to use it as a boilerplate? Sure thing!

# How it works
The idea behind it is that you deploy the solution directly via the pipeline (github actions) and whenever any of the users post messages in any of the slack channels where the bot has been added to, the messages get received by the Slackbot, they get inserted into a queue and they later get analyzed. Bear in mind that the same happens when a messages is getting modified. When a message is edited by a user, the message is being inserted again into the queue and it gets analyzed and stored without deleting the results of the analysis either of the original message or of any older versions of it. The results of the analysis are being saved in a S3 bucket and then any meaningful information that anyone might be interested in can be extracted using the AWS Athena service. Regarding the deployment process, it takes place via the Serverless framework - the template is available [here (link)](./infrastructure/serverless/serverless.yaml).

# The structure of the repository

- The `.configuration/` folder includes the configuration of the environments/stages.
- The `.diagrams/` folder includes the diagrams of the whole application/stack.
- The `.github/workflows/` folder includes the the definitions of the GitHub actions that have been configured for this repository.
- The `functions/` folder includes the source code of the lambda functions that are connected with the stack. 
- The `infrastructure/` folder includes the IaC.
- Other files.

# How to extract meaningful information based on the analyzed messages

The application stores the information in an S3 bucket. I guess that you are now wondering how you are supposed to access the results of the analyzed messages. Well, there's no dashboard or something for quickly accesing the data. The slackbot was built to analyze the messages and store them in an S3 bucket for later consumption. If you would be interested in running queries directly against the S3 bucket, you can use AWS Athena. However, since the results are stored in an S3 bucket, if you would be interested in saving these data in any kind of database, you can pretty easily create a lambda which will be getting triggered every time a new object is getting stored and that lambda will be responsible for reading the content of the JSON object, manipulate it -if needed- and store it in any kind of database (e.g. DynamoDB, RDS, etc).

## The structure of the JSON objects that include the analyzed messages

```
{
    "messageBody": "I like Slenti. It is awesome!",
    "slackChannelId": "C012ABCDE3F",
    "slackMessageEventTs": "1660000000.000000",
    "slackUserId": "U01ABCDEFGH",
    "slackMessageTs": "1660000000.000000",
    "classifiedAsLabel": "positive",
    "classifiedAsProbability": "0.9506572042465574",
    "classifiedAsLogLikelihood": "-29.881178994701806",
    "scores": {
        "positive": {
            "label": "positive",
            "probability": "0.9506572042465574",
            "logLikelihood": "-29.881178994701806"
        },
        "negative": {
            "label": "negative",
            "probability": "0.04428668402234906",
            "logLikelihood": "-32.94764848859803"
        },
        "neutral": {
            "label": "neutral",
            "probability": "0.005056111731093468",
            "logLikelihood": "-35.11773477874752"
        }
    }
}
```

## Athena Queries

### Create Athena table

The query below will create a new table in the `default` database in Athena.

```
CREATE EXTERNAL TABLE IF NOT EXISTS `default`.`slenti-test` (
`messageBody` string,
`slackChannelId` string,
`slackMessageEventTs` string,
`slackUserId` string,
`slackMessageTs` string,
`classifiedAsLabel` string,
`classifiedAsProbability` string,
`classifiedAsLogLikelihood` string,
`scores` string
)
ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
WITH SERDEPROPERTIES (
'serialization.format' = '1'
) LOCATION 's3://{nameOfTheS3Bucket}/'
```

Don't forget to:
- Replace the `{nameOfTheS3Bucket}` with the name of the s3 bucket where the results are being saved.
- Change the name of the table from `slenti-test` to something else.

### Basic queries

#### Get the positive messages

```
SELECT 
    "default"."slenti-test".*
FROM 
    "default"."slenti-test"
WHERE
    "default"."slenti-test".classifiedaslabel = 'positive'
```

#### Get the messages which are positive and have probability greather than 0.7

```
SELECT 
    "default"."slenti-test".*
FROM 
    "default"."slenti-test"
WHERE
    CAST(JSON_EXTRACT("default"."slenti-test".scores, '$.positive.probability') AS DOUBLE) > 0.7
```

#### Get the number of positive, negative and neutral messages that each user posted between 2 given dates

```
SELECT 
    "default"."slenti-test".slackuserid,
    SUM(CASE WHEN ("default"."slenti-test".classifiedaslabel = 'positive') THEN 1 ELSE 0 END) AS positiveMessages,
    SUM(CASE WHEN ("default"."slenti-test".classifiedaslabel = 'negative') THEN 1 ELSE 0 END) AS negativeMessages,
    SUM(CASE WHEN ("default"."slenti-test".classifiedaslabel = 'neutral') THEN 1 ELSE 0 END) AS neutralMessages
FROM 
    "default"."slenti-test"
WHERE
    FROM_UNIXTIME(CAST(SPLIT_PART("default"."slenti-test".slackmessagets, '.', 1) AS bigint)) BETWEEN DATE '2022-09-04' AND DATE '2022-09-06'
GROUP BY 
    slackuserid
```

### Optimization

Based on how you are planning to use the solution, you can apply additional changes so as to optmize the tables and improve the performance of the queries.

Some helpful resource are:
- https://docs.aws.amazon.com/athena/latest/ug/partitions.html
- https://aws.amazon.com/blogs/big-data/top-10-performance-tuning-tips-for-amazon-athena/

# How to deploy it - step by step

## 1. AWS Account & IAM

In your AWS account, create an IAM user with -ideally- only Programmatic Access. Let's call this user `slenti-github-cicd`.
Since this user acts as the main service account for the pipeline, the `PowerUserAccess` policy will grant sufficient permissions. Hey, I can hear you mumbling about not following the Principle of Least Privilege.

Once the user is created, create a set of Access Keys and keep them somewhere, we will need them in a bit.

## 2. GitHub repository

Clone this repository. 

## 3. Create a new environment/stage

### 3.1 Define the environment

More information is available [here (link)](.configuration/README.md#define-the-environment)

### 3.2 Create configuration file.

More information is available [here (link)](.configuration/README.md#create-the-configuration-file)

## 4. Save the AWS Access Keys in the Github Actions Secrets

In the `1` step, you created a set of Access Keys for the newly created user. Now it's time to make the GitHub actions make use of those access keys by storing them on Github.
All the steps regarding the creation of the GitHub's secrets are described in detail [here (link)](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

In a nutshell, each environment requires 2 secrets.
- The first one stores the AWS Access Key ID. The naming convention is: `{environment}_AWS_ACCESS_KEY_ID`.
- The second one stores the AWS Secret Access Key. The naming convention is: `{environment}_AWS_SECRET_ACCESS_KEY`.

Don't forget:
- The `{environment}` is the environment with which those access keys are associated with. In case you want to deploy multiple environments within the same AWS account, feel free to use the same access keys.

## 5. Create a Slack Application

Tutorial: https://slack.com/help/articles/115005265703-Create-a-bot-for-your-workspace

The bot needs to have only __Bot Token Scopes__.
The list of the scopes is available below:
- `channels:history`
- `groups:history`
- `im:history`
- `mpim:history`

Once you configure the permissions and you install the Slack Application in your desired Slack workspace, the __Bot User OAuth Token__ will be created. This token will be used later on for the connection between our Slackbot and Slack.

## 6. Create the required parameters in the AWS Systems Manager Parameter Store

Each environment requires 2 parameters.

- The first one stores the Slack's __Bot User OAuth Token__. 
    
    The naming convention is: `/{serviceName}/{environment}/functions/slackbot/env-variables/SLACK_BOT_TOKEN`.

- The second one stores the Slack's __Signing Secret__. 

    The naming convention is: `/{serviceName}/{environment}/functions/slackbot/env-variables/SLACK_SIGNING_SECRET`.

Don't forget:
- The `{serviceName}` is the `INFRASTRUCTURE.SERVERLESS.SERVICE.NAME` as it is explained in the step `3.2`. 
- The `{environment}` is the environment.

Why don't we use the Secrets Manager? Well, that's just because we don't need the additional features and the free encrypted parameters are absolutely fine. 

## 7. Deploy the serverless stack

Theoretically, at this point everything is configured properly and the next step is to run the GitHub action that is responsible for deploying the stack.
To do so, open the `Actions` page and click on the `Test or Deploy or Remove` workflow. 

There are 3 jobs available. 

### Testing & Linting (testing-and-linting)
This job is responsible for linting and running tests. For the testing part, the `localstack` is being used in order to emulate -in our case- the S3 and the SQS services.

### Deploy stack (deploy-full-serverless-stack)
This job is responsible for deploying the serverless stack for a given environment/stage. However, before the deployment, the `Testing & Linting` job runs always so as to ensure that everything is fine. 

### Remove stack (remove-serverless-stack)
This job is responsible for removing the serverless stack for a given environment/stage.

Choose the `deploy-full-serverless-stack`, write in the `Environment` field your desired environment and click `Run workflow`. The whole process will take a couple of minutes, so relax and enjoy it.

### 8. Update the Slack Application with the endpoint of the API Gateway that belongs to the Slackbot

Once the stack is deployed and as shown in the [architecture diagram (link)](./.diagrams), there will be an API Gateway sitting in front of the Slackbot lambda function. The Slack Application, that was created in the step `5`, needs to be updated so it can start forwarding the messages to the lambda function. 

This can be done by opening the `Event Subscription` [configuration page (link)](https://api.slack.com/apis/connections/events-api#the-events-api__subscribing-to-event-types) of the Slack Application.

In that page, you have to:
- Enable the events

- Set the `Request URL`
    The URI should follow the following pattern:
    `https://{idOfTheApiGateway}.execute-api.{region}.amazonaws.com/slack/events`

    Don't forget:
    - The `{idOfTheApiGateway}` is the ID of the API Gateway that was created by the stack (e.g. `ab123cde4f`). 
    - The `region` is the region (e.g. `eu-central-1`).

- Subscribe to the following 4 events.
    - `message.channels`
    - `message.groups`
    - `message.im`
    - `message.mpim`

### 9. Confirm that everything works smoothly
Once you reach this step, everything should be running smootly.
The steps to confirm that are:
- Open a slack channel where you want to perform sentiment analysis.

- Invite/Add the bot in the slack channel. 

- Send a message.

- Wait for a few seconds.

- Open the s3 bucket that was created by the serverless stack.
    
    The naming convention is `{environment}-{serviceName}-{s3StoreResultsBucketSuffix}` where:

    - The `{environment}` is the environment.
    - The `{serviceName}` is the `INFRASTRUCTURE.SERVERLESS.SERVICE.NAME` as it is explained in the step `3.2`. 
    - The `{s3StoreResultsBucketSuffix}` is the `INFRASTRUCTURE.SERVERLESS.S3.STORE_RESULTS_BUCKET.SUFFIX` as it is explained in the step `3.2`. 

    The messages are stored following a nested folder structure: `/{year}/{month}/{day}/{filename}`.
    
    - The `{year}` is the year (2xxx) when the event on Slack took place.
    - The `{month}` is the month (0-12) when the event on Slack took place. 
    - The `{day}` is the day (0-31) of the month when the event on Slack took place. 
    - The `{filename}` is the MD5 hash of the base64 encoded string of the concatenation of the following values:
        - slackChannelId
        - slackUserId
        - slackMessageEventTs
        - slackMessageTs


# License 

All rights of logos, images, datasets belong to their respective owners and nobody claims any right over them.

This source code is licensed under the MIT License.

# References 

- Dataset: [GoEmotions (link)](https://ai.googleblog.com/2021/10/goemotions-dataset-for-fine-grained.html).
- Naive Bayes classifier for node.js ([classificator (link)](https://www.npmjs.com/package/classificator)).
- [Serverless framework (link)](https://www.serverless.com/).
- [Localstack (link)](https://localstack.cloud/).

**Thodoris Itsios** (https://itsios.eu)