class PaymentService {
  #dataPersistor;
  #fileClient;
  constructor(dataPersistor, fileClient) {
    this.#dataPersistor = dataPersistor;
    this.#fileClient = fileClient;
  }
  async handleSqsPayments(event) {
    console.info("Handling sqs payment started", { PaymentId: event.id });
    const paymentRequest = this.#createDataPersistRequest(event);
    await this.#dataPersistor.persistData(paymentRequest);
    console.info("Successfully handled sqs payment");
    return;
  }

  async handleS3Payments(event) {
    console.info("Handling s3 payment started", event);
    const paymentObject = await this.#getObjectFromS3(
      event.s3.bucket.name,
      event.s3.object.key.replace(/\+/g, " ")
    );
    const paymentRequest = this.#createDataPersistRequest(paymentObject);
    await this.#dataPersistor.persistData(paymentRequest);
    console.info("Successfully handled s3 payment");
    return;
  }

  #createDataPersistRequest(payment) {
    const totalDiscount = (payment.total * process.env.discount) / 100;
    const refundableAmount = payment.total - totalDiscount;
    return {
      TableName: "Payments",
      Item: {
        PaymentId: payment.paymentNumber,
        PaidAmount: `$${payment.total}`,
        DiscountPercentage: `${process.env.discount}%`,
        TotalDiscount: `$${totalDiscount}`,
        CalculatedTotalAmount: `$${refundableAmount}`,
        TransactionDateTime: payment.timestamp,
      },
    };
  }

  async #getObjectFromS3(bucketName, objectKey) {
    const data = await this.#fileClient.getObject({
      Bucket: bucketName,
      Key: objectKey,
    });
    return data;
  }
}

module.exports = PaymentService;
