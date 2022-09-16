# Configuration

## New environment/stage

For every environment, as it is also exaplined here [(link)](../README.md), you have to insert it into the `list` array that is available in the `allowed-environments.json` file. Once that's done, a new dedicated configuration file needs to be created in the `env-configuration/` folder.

### Define the environment

In the `allowed-environments.json` JSON file, there's one array called `list` which includes the names of the environments/stages where the stack has been deployed. By default, there's only 1 environment (`dev`) available in this repository mainly for templating purposes. Feel free to add in the aforementioned list as many environments as you want. There's no limit.

### Create the configuration file

In the `env-configuration/` folder, the dedicated configuration files that are connected with the environments/stages are available.

The naming convention of those files is: `{environment}.general-configuration.json`.

For each new environment, you have to:
- Duplicate one of the already existing configuration files,
- Replace the `{environment}` with the name of the environment as it was added in the `allowed-environments.json` file.

Each configuration file should include:

- `COMMON.STACK_VERSION`

    The version of the stack that you are deploying. It is for internal usage.

- `COMMON.PROJECT_NAME`

    The name of the project. You can leave it as is. It's not being used somehow and it is not visible anywhere.

- `COMMON/AWS_ACCOUNT_ID`

    The ID of the AWS account where the stack of this specific envionment will be deployed.

- `COMMON.AWS_REGION`

    The region where the stack will be deployed.

- `INFRASTRUCTURE.SERVERLESS.SERVICE.NAME`

    The base name of the stack that will be deployed.

    The naming convention of the stacks is: `{INFRASTRUCTURE.SERVERLESS.SERVICE.NAME}-{environment}` (e.g. `slenti-dev`).

- `INFRASTRUCTURE.SERVERLESS.FUNCTIONS.SENTIMENT_ANALYSIS.STORE_MESSAGE_CONTENT_AFTER_ANALYSIS`
    
    The value can be either `true` or `false`. The default value is `false`.

    When the app analyzes a message, it stores the results in a given S3 bucket. Each object includes the results of the analysis but if this is set to `true`, it will also save the message itself within the same JSON object. Sometimes, some organizations should follow strict rules and storing messages outside of Slack can be considered a deal-breaker. 

- `INFRASTRUCTURE.SERVERLESS.S3.STORE_RESULTS_BUCKET.SUFFIX`

    The suffix that will be added while composing the name of the S3 bucket where the results of the sentiment analysis will be stored. Don't forget to replace it since the names of the S3 buckets should be unique.

    The naming convention is: `{environment}-{INFRASTRUCTURE.SERVERLESS.SERVICE.NAME}-{INFRASTRUCTURE.SERVERLESS.S3.STORE_RESULTS_BUCKET.SUFFIX}`.
