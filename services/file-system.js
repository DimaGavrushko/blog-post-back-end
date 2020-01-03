const fs = require('fs');
const util = require('util');

async function readFileAsync(path) {
  try {
    const readFile = util.promisify(fs.readFile);
    return await readFile(path);
  } catch (e) {
    throw e;
  }
}

async function deleteFileAsync(path) {
  try {
    const deleteFile = util.promisify(fs.unlink);
    await deleteFile(path);
  } catch (e) {
    throw e;
  }
}

module.exports = {
  readFileAsync,
  deleteFileAsync
};
