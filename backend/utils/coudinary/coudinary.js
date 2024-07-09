const cloud = require("cloudinary").v2;
const streamifier = require("streamifier");
const fs = require("fs");

cloud.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports.deleteFile = async (file) => {
    console.log("in the delete",file)
  const publicId = file.substring(
    file.lastIndexOf("/") + 1,
    file.lastIndexOf(".")
  );
  console.log("file====", file);
  console.log("publicId", publicId);
  return new Promise((resolve, rejects) => {
    cloud.uploader.destroy(publicId, function (err, result) {
      if (err) {
        console.error("err", err);
      } else {
        console.info("result", result);
        resolve(result);
      }
    });
  });
};

module.exports.uploadFile = async (path) => {
  return new Promise((resolve, rejects) => {
    cloud.uploader.upload_large(
      path,
      {
        resource_type: "auto",
        chunk_size: 6000000,
      },
      function (error, result) {
        if (error) {
          console.error("error", error);
        } else {
          resolve(result.url);
        }
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      }
    );
  });
};
module.exports.uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloud.uploader.upload_stream(
      {
        // folder:''
      },
      (error, result) => {
        if (result) {
          console.log("result--", result);
          resolve(result.secure_url);
        } else {
          console.log("error", error); // here should throw an error why using middleware {temp code}
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};