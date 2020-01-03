// eslint-disable-next-line import/no-self-import
const multer = require('multer');

module.exports = (() => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${__dirname}/../uploads/tmp`);
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
    }
  });

  const upload = multer({ storage });

  return {
    upload
  };
})();
