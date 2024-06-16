const { GetObjectCommand, S3Client } = require("@aws-sdk/client-s3");

class S3Manager {
  #client;
  constructor() {
    this.#client = new S3Client({});
  }
  async getObject(params) {
    try {
      console.info("Getting object from s3 started");
      const command = new GetObjectCommand(params);
      const response = await this.#client.send(command);
      const str = await response.Body.transformToString();
      console.info("Successfully retieved data from s3");
      return JSON.parse(str);
    } catch (error) {
      console.error("Error in getting object from S3", {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}

module.exports = S3Manager;
