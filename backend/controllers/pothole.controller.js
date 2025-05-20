const uploadOnCloudinary = require('../utils/cloudinary.js'); 
const streamifier = require('streamifier');
const Pothole = require('../models/pothole.model.js');
const cloudinary = require('cloudinary').v2;

exports.sendPotholeRecordingAndLocation = async (req, res) => {
  try {
    // Check if video file exists
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }else{
        console.log(req.file.path);
    }

    const { latitude, longitude, accuracy, timestamp } = req.body;

    // Validate coordinates
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const acc = parseFloat(accuracy);

    if (
      isNaN(lat) || isNaN(lon) ||
      lat < -90 || lat > 90 ||
      lon < -180 || lon > 180
    ) {
      return res.status(400).json({ message: 'Invalid latitude or longitude' });
    }

    // // Upload video to Cloudinary
    // const uploadStream = cloudinary.uploader.upload(
    //   {
    //     resource_type: "video",
    //     folder: "pothole-reports",
    //     public_id: `pothole-${Date.now()}`,
    //     overwrite: true,
    //   },
    //   async (error, result) => {
    //     if (error) {
    //       console.error('Cloudinary upload error:', error);
    //       return res.status(500).json({ message: 'Failed to upload video' });
    //     }

    //     try {
    //       const pothole = new Pothole({
    //         videoUrl: result.secure_url,
    //         location: {
    //           type: 'Point',
    //           coordinates: [lon, lat] // GeoJSON format: [longitude, latitude]
    //         },
    //         accuracy: isNaN(acc) ? undefined : acc,
    //         timestamp: timestamp ? new Date(timestamp) : new Date()
    //       });

    //       await pothole.save();

    //       res.status(201).json({
    //         message: 'Pothole report created successfully',
    //         data: pothole
    //       });
    //     } catch (saveError) {
    //       console.error('Database save error:', saveError);

    //       // Optionally delete uploaded video on DB failure
    //       await cloudinary.uploader.destroy(result.public_id, { resource_type: "video" });

    //       res.status(500).json({ message: 'Failed to create pothole report' });
    //     }
    //   }
    // );

    const videoFilePath = req.file?.path
    console.log(videoFilePath);

    const cloudinaryResponse = await uploadOnCloudinary(videoFilePath);
    console.log(cloudinaryResponse);


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
    

    // const pothole = await Pothole.create({
    //     videoUrl: cloudinaryResponse.url,
    //     location: {
    //         type: 'Point',
    //         coordinates: [lon, lat] // GeoJSON format: [longitude, latitude]
    //     },
    //     accuracy: isNaN(acc) ? undefined : acc,
    //     timestamp: timestamp ? new Date(timestamp) : new Date()
    // })

    // res.status(200).json({message: "uploaded successfully", data: pothole})

    // Stream the video buffer to Cloudinary
    // streamifier.createReadStream(req.file.buffer).pipe(uploadStream);

  } catch (error) {
    console.error('Unhandled error in createPothole:', error);
    res.status(500).json({ message: 'Server error while creating pothole report' });
  }
};
