const uploadOnCloudinary = require('../utils/cloudinary.js'); 
const Pothole = require('../models/pothole.model.js');

exports.sendPotholeRecordingAndLocation = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const { latitude, longitude, accuracy, timestamp } = req.body;

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

    const videoFilePath = req.file.path;

    // Upload to Cloudinary using utility function
    const cloudinaryResponse = await uploadOnCloudinary(videoFilePath);

    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
      return res.status(500).json({ message: 'Video upload to Cloudinary failed' });
    }

    const pothole = await Pothole.create({
      videoUrl: cloudinaryResponse.secure_url,
      location: {
        type: 'Point',
        coordinates: [lon, lat],
      },
      accuracy: isNaN(acc) ? undefined : acc,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    // console.log(pothole);

    return res.status(201).json({
      message: 'Pothole reported successfully',
      data: pothole
    });


  } catch (error) {
    console.error('Error in sendPotholeRecordingAndLocation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
