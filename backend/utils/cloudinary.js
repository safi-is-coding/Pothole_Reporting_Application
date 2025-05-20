// const cloudinary = require('cloudinary').v2;
// const fs =  require("fs")

// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
//     api_key: process.env.CLOUDINARY_API_KEY , 
//     api_secret: process.env.CLOUDINARY_API_SECRET  
// });


const cloudinary = require('cloudinary').v2;
const fs = require("fs");

cloudinary.config({ 
  cloud_name: "dpfb1od3c", 
  api_key: "988836346312584", 
  api_secret: "h4pbbvxXRBse9QMvcz4I8iL9KL4"
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "video",
      folder: "pothole-reports"
    });

    fs.unlinkSync(localFilePath); // Cleanup temp file
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    return null;
  }
};

module.exports = uploadOnCloudinary;



    // async function run() {
    //   try {
    //     const result = await cloudinary.uploader.upload(file, {resource_type: "video"})
    //     console.log(result.secure_url);
  
    //     const pothole = await Pothole.create({
    //       videoUrl: result.secure_url,
    //       location: {
    //           type: 'Point',
    //           coordinates: [lon, lat] // GeoJSON format: [longitude, latitude]
    //       },
    //       accuracy: isNaN(acc) ? undefined : acc,
    //       timestamp: timestamp ? new Date(timestamp) : new Date()
    //   })
    //     console.log(pothole);
  
    //     res.status(200).json({message: "uploaded successfully", data: pothole})
  
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }