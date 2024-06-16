class PaymentService {
  #dataPersistor;
  constructor(dataPersistor) {
    this.#dataPersistor = dataPersistor;
  }
  async handleSqsPayments(payment) {
    console.info("Handling sqs payament started", { PaymentId: payment.id });
    const paymentRequest = this.#createDataPersistRequest(payment);
    await this.#dataPersistor.persistData(paymentRequest);
    console.info("Successfully handled sqs payament");
    return;
  }

  #createDataPersistRequest(payment) {
    const totalDiscount = (payment.total * process.env.discount) / 100;
    const refundableAmount = payment.total - totalDiscount;
    return {
      TableName: "Payments",
      Item: {
        PaymentId: payment.id,
        PaidAmount: `$${payment.total}`,
        DiscountPercentage: `${process.env.discount}%`,
        TotalDiscount: `$${totalDiscount}`,
        CalculatedTotalAmount: `$${refundableAmount}`,
        TransactionDateTime: payment.timestamp,
      },
    };
  }
}

module.exports = PaymentService;
