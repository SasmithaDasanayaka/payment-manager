const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

class DynamoDbManager {
  #client;
  #ddbDocClient;
  constructor() {
    this.#client = new DynamoDBClient({ region: process.env.AWS_REGION });
    this.#ddbDocClient = DynamoDBDocumentClient.from(this.#client);
  }

  async persistData(params) {
    try {
      console.info("Inserting data to dynamoDB started");
      const command = new PutCommand(params);
      await this.#ddbDocClient.send(command);
      console.info("Successfully inserted data to dynamoDB");
      return;
    } catch (error) {
      console.error("Error in dynamoDB manager", {
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

module.exports = DynamoDbManager;
