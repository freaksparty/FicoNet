var multer = require("multer"),
    upload;

upload = multer({
    dest: 'uploads/',
    limits : {
        fileSize : 5 * 1024 * 1024
    }
});

module.exports = {
    uploadAvatar : function (req, res, next) {
        upload.single('file')(req, res, next);
    },

    manageAvatar : function (req, res, next) {
        console.log(req.file);
        next();
    }
}