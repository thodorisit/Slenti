#!bin/bash

echo "----- Configure profile for AWS cli -----"

export AWS_ACCESS_KEY_ID="slenti-test-access-key-id"
export AWS_SECRET_ACCESS_KEY="slenti-test-secret-access-key"
export AWS_DEFAULT_REGION="us-east-1"

mkdir -p ~/.aws

touch ~/.aws/config

echo "
[profile slenti-localstack]
aws_access_key_id=$AWS_ACCESS_KEY_ID
aws_secret_access_key=$AWS_SECRET_ACCESS_KEY
region=$AWS_DEFAULT_REGION
" > ~/.aws/config

echo "
[default]
aws_access_key_id=$AWS_ACCESS_KEY_ID
aws_secret_access_key=$AWS_SECRET_ACCESS_KEY
region=$AWS_DEFAULT_REGION
" > ~/.aws/credentials