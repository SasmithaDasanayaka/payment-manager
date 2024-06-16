const PaymentsController = require("./payments/payments.controller.js");
const PaymentService = require("../services/payments.service.js");
const DynamoDbManager = require("../sharedServices/dynamoDB.service.js");

const dynamoDBManager = new DynamoDbManager();
const paymentService = new PaymentService(dynamoDBManager);
const paymentsController = new PaymentsController(paymentService);

module.exports.handleSqsPayments = paymentsController.handleSqsPayments;
