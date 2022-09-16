#!bin/bash

echo "------SQS QUEUES------"

ENDPOINT_URL="http://localhost:4566"
AWS_PROFILE="slenti-localstack"
AWS_REGION="us-east-1"
QUEUE_NAME="slenti-message-analysis"

echo "########### Create SQS queues ###########"
aws sqs create-queue --region=$AWS_REGION --endpoint-url=$ENDPOINT_URL --profile=$AWS_PROFILE --queue-name=$QUEUE_NAME

echo "########### List SQS queues ###########"
aws sqs list-queues --region=$AWS_REGION --endpoint-url=$ENDPOINT_URL --profile=$AWS_PROFILE