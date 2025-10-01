// const cloudinary = require("cloudinary").v2;

// const connectCloudinary = async () => {
//   cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
//   });
// };

// module.exports = connectCloudinary;

const cloudinary = require("cloudinary").v2;

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // 🔥 test connection
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary connected ", result);
  } catch (err) {
    console.error("Cloudinary connection failed ", err);
  }
};

module.exports = connectCloudinary;
