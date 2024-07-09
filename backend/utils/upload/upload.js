const multer = require('multer');
const path = require("path");

module.exports = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    console.log("your multer is run");
    console.log("you have image in req",file)
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});