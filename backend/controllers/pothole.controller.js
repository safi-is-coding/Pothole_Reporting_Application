const uploadOnCloudinary = require('../utils/cloudinary.js'); 
const Pothole = require('../models/pothole.model.js');
const asyncHandler = require("../utils/asyncHandler.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");

exports.sendPotholeRecordingAndLocation = asyncHandler(async (req, res) => {
  try {
    console.log("reached controller...");

    if (!req.file) {
      console.log("No video file uploaded");
      throw new ApiError(400, 'No video file uploaded');
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
      throw new ApiError(400, "Invalid latitude or longitude");
    }

    const videoFilePath = req.file.path;
    console.log("Video file path:", videoFilePath);

    // Upload to Cloudinary using utility function
    const cloudinaryResponse = await uploadOnCloudinary(videoFilePath);

    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
      throw new ApiError(500, "Video upload to Cloudinary failed");
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

    console.log(pothole);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          pothole,
          'Pothole reported successfully'
        )
      );

  } catch (error) {
    console.error('Error in sendPotholeRecordingAndLocation:', error);
    throw new ApiError(500, "Internal server error");
  }
});
