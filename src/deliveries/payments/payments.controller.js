class PaymentsController {
  #PaymentService;
  constructor(payamentService) {
    this.#PaymentService = payamentService;
    this.handleSqsPayments = this.handleSqsPayments.bind(this);
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
    return;
  }
}

module.exports = PaymentsController;
