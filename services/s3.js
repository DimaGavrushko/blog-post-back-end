const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

class S3Service {

  constructor(accessKeyId, secretAccessKey, bucketName) {
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.bucketName = bucketName;
    this.s3 = null;
  }

  connect() {
    try {
      AWS.config.update({
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey
      });
      this.s3 = new AWS.S3();

    } catch (err) {}

  }

  /*async upload() {
    const params = {
      Bucket: this.bucketName,
      Body: fs.createReadStream(__dirname + '/../files/download.jpeg'),
      Key: "avatars/" + Date.now() + "_" + path.basename('../files/download.jpeg')
    };
    console.log(await this.s3.upload(params).promise());
  }*/

}

module.exports = S3Service;
