const multer = require('multer');

module.exports = (function () {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '/../uploads/tmp');
        },
        filename: (req, file, cb) => {
            cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
        },
    });

    const upload = multer({storage: storage});

    return {
        upload
    }
})();