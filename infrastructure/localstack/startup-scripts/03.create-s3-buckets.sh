#!bin/bash

echo "------S3 BUCKETS------"

ENDPOINT_URL="http://localhost:4566"
AWS_PROFILE="slenti-localstack"
AWS_REGION="us-east-1"
BUCKET_NAME="slentiv1-analyzed-messages-results"

echo "########### Create S3 buckets ###########"
aws s3api create-bucket --bucket=$BUCKET_NAME --region=$AWS_REGION --endpoint-url=$ENDPOINT_URL --profile=$AWS_PROFILE

echo "########### List S3 buckets ###########"
aws s3api list-buckets --region=$AWS_REGION --endpoint-url=$ENDPOINT_URL --profile=$AWS_PROFILE

echo "########### List S3 objects in \"slentiv1-analyzed-messages-results\" bucket ###########"
aws s3api list-objects --bucket=$BUCKET_NAME --region=$AWS_REGION --endpoint-url=$ENDPOINT_URL --profile=$AWS_PROFILE