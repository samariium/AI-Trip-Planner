const mongoose = require('mongoose');

const localContactSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      enum: [
        'Tourist Guide',
        'Taxi Service',
        'Homestay',
        'Emergency',
        'Hospital',
        'Police',
        'Tourism Office',
        'Restaurant',
        'Hotel'
      ]
    },
    contactInfo: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    languages: [{ type: String }],
    available: {
      type: String,
      default: '24/7'
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('LocalContact', localContactSchema);
