# Payment Manager Serverless Application

This is a serverless application using the AWS ecosystem and the Serverless Framework that processes events from S3 and SQS, transforms the data, and stores the results in a DynamoDB.

### Deployment

In order to deploy the application, you need to run the following command:

```
$ serverless deploy
```

### Invocation

1. Send a message to payments.fifo queue from AWS console. An example message can be found in sample.json file
2. Upload a json file to all-payments S3 bucket. An example json file is sample.json file
3. The aggreagated data can be found in Payments DynamoDB
4. Access payment-manager-dev-SQSPaymentsHandler and payment-manager-dev-S3PaymentsHandler cloudwatch log groups for monitoring the logs. 


### Architecture

#### Decisions
1. Implemented the redrive policy to retry processing the messages published to SQS and eventually persist the failed messages in the dead letter queue.
2. Used a FIFO queue to maintain the order of the received messages.
3. Returned the batch failure items after processing the SQS events to avoid processing the successful events again.
4. Introduced environment variables to Lambda functions to avoid deployments when changing the variable values.

#### Improvements
1. Instead of directly invoking a Lambda function for S3 object insertion, first send the message to a message broker (SQS) to ensure that Lambda failures do not result in lost events.
2. Instead of immediately retrying Lambda function invocations on failure, adopt a backoff algorithm to wait before the next iteration.

![screenshot](Architecture.png)
