const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const multer = require('multer');


cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.cloud_key, 
    api_secret: process.env.cloud_secret 
  });


  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'YelpCamp',
      allowedFormats: ['jpeg', 'png', 'jpg'],
     // format: async (req, file) => 'png', // supports promises as well
      //public_id: (req, file) => 'computed-filename-using-request',
    },
  });

  module.exports = {
      cloudinary,
      storage
  }