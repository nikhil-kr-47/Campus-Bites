const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary=require("./cloudinaryConfig");
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "CampusBites",
      allowed_formats:["png","jpg","jpeg"],
     
    },
  });

  module.exports=storage;