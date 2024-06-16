const PaymentsController = require("./payments/payments.controller.js");
const PaymentService = require("../services/payments.service.js");
const DynamoDbManager = require("../sharedServices/dynamoDB.service.js");
const S3Manager = require("../sharedServices/s3.service.js");

const dynamoDBManager = new DynamoDbManager();
const s3Manager = new S3Manager();
const paymentService = new PaymentService(dynamoDBManager, s3Manager);
const paymentsController = new PaymentsController(paymentService);

module.exports.handleSqsPayments = paymentsController.handleSqsPayments;
module.exports.handleS3Payments = paymentsController.handleS3Payments;
