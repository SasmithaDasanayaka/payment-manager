class PaymentsController {
  #PaymentService;
  constructor(payamentService) {
    this.#PaymentService = payamentService;
    this.handleSqsPayments = this.handleSqsPayments.bind(this);
    this.handleS3Payments = this.handleS3Payments.bind(this);
  }

  async handleSqsPayments(event, context) {
    console.log(context.functionName, {
      event: JSON.stringify(event),
      context,
    });

    const batchItemFailures = [];
    for (const record of event.Records) {
      try {
        const body = JSON.parse(record.body);
        await this.#PaymentService.handleSqsPayments(body);
      } catch (error) {
        console.error("Error in handling sqs payment", {
          message: error.message,
          stack: error.stack,
        });
        batchItemFailures.push({ itemIdentifier: record.messageId });
      }
    }
    return batchItemFailures;
  }

  async handleS3Payments(event, context) {
    console.log(context.functionName, {
      event: JSON.stringify(event),
      context,
    });

    for (const record of event.Records) {
      try {
        await this.#PaymentService.handleS3Payments(record);
      } catch (error) {
        console.error("Error in handling s3 payment", {
          message: error.message,
          stack: error.stack,
        });
      }
    }
    return;
  }
}

module.exports = PaymentsController;
