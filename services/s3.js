const AWS = require('aws-sdk');
const fileSystem = require('./file-system');

module.exports = (function() {
  let s3 = null;
  let bucketName;

  function connect(accessKeyId, secretAccessKey, _bucketName) {
    try {
      AWS.config.update({
        accessKeyId,
        secretAccessKey
      });
      bucketName = _bucketName;
      s3 = new AWS.S3();
      console.log('connected to s3');
    } catch (err) {
      throw err;
    }
  }

  async function upload(directory, path, fileName) {
    try {
      const fileData = await fileSystem.readFileAsync(path);
      const params = {
        Bucket: bucketName,
        Body: fileData,
        Key: `${directory}/${fileName}`,
        ACL: 'public-read-write'
      };
      const result = await s3.upload(params).promise();
      await fileSystem.deleteFileAsync(path);
      return {
        url: result.Location,
        s3Key: result.Key
      };
    } catch (e) {
      throw e;
    }
  }

  async function deleteImg(s3Key) {
    try {
      const params = {
        Bucket: bucketName,
        Key: s3Key
      };
      await s3.deleteObject(params).promise();
    } catch (e) {
      throw e;
    }
  }

  return {
    connect,
    upload,
    deleteImg
  };
})();
