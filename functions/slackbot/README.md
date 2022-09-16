# Function: slackbot

## Scripts

### Lint

```
npm run lint
```

### Run JEST tests

If the [localstack (link)](../../infrastructure/README.md#infrastructure-localstack) resources are running already, you can use the following command in order to run the tests.

```
npm run test:simple
```

**No real AWS services are being used for testing purposes.**

### Start localstack and run JEST tests

If the [localstack (link)](../../infrastructure/README.md#infrastructure-localstack) hasn't been started and you want to spin up the docker container with the AWS services before running the tests, you can use the following command.

```
npm run test:localstack
```

**No real AWS services are being used for testing purposes.**