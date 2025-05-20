const mongoose = require("mongoose")

const potholeSchema = new mongoose.Schema(
    {
        videoUrl: {
            type: String,
            required: true
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        accuracy: {
            type: Number,
            required: true   
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }
)

potholeSchema.index({ location: "2dsphere" })

const Pothole = mongoose.model("Pothole", potholeSchema)
module.exports = Pothole