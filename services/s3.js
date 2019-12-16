const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const fileSystem = require('./file-system');
const util = require('util');

module.exports = (function () {

    let s3 = null;
    let bucketName;

    function connect(accessKeyId, secretAccessKey, _bucketName) {
        try {
            AWS.config.update({
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey
            });
            bucketName = _bucketName;
            s3 = new AWS.S3();
            console.log('connected to s3');
        } catch (err) {
            console.log(err);
        }

    }

    async function upload(directory, path, fileName) {
        try {
            const fileData = await fileSystem.readFile(path);
            const params = {
                Bucket: bucketName,
                Body: fileData,
                Key: `${directory}/${fileName}`,
                ACL: 'public-read-write'
            };
            const result = await s3.upload(params).promise();
            await fileSystem.deleteFile(path);
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
            let res = await s3.deleteObject(params).promise();
        } catch (e) {
            throw e;
        }
    }

    return {
        connect,
        upload,
        deleteImg
    }
})();
