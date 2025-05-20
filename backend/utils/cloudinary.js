const cloudinary = require('cloudinary').v2;
const fs =  require("fs")

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
    api_key: process.env.CLOUDINARY_API_KEY , 
    api_secret: process.env.CLOUDINARY_API_SECRET  
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log(localFilePath);
        if(!localFilePath) return null
        
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        
        // file has been uploaded successfully
        console.log("File is uploaded on cloudinary", response.url);

        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temp file as the upload operation got failed
        return null
    }
}

module.exports = uploadOnCloudinary


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