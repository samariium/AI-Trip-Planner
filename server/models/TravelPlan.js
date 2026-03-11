const mongoose = require('mongoose');

const travelPlanSchema = new mongoose.Schema(
  {
    source: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    overview: { type: String },
    aiNote: { type: String },
    travelOptions: [mongoose.Schema.Types.Mixed],
    attractions: [mongoose.Schema.Types.Mixed],
    localFoods: [mongoose.Schema.Types.Mixed],
    localContacts: [mongoose.Schema.Types.Mixed],
    travelTips: [String],
    bestTimeToVisit: { type: String },
    localLanguage: { type: String },
    currency: { type: String },
    itinerary: [mongoose.Schema.Types.Mixed],
    budget: { type: mongoose.Schema.Types.Mixed },
    sourceCoords: {
      lat: { type: Number },
      lng: { type: Number }
    },
    destCoords: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  { timestamps: true }
);

// TTL index — auto-delete cached plans after 24 hours
travelPlanSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

// Compound index for fast lookups
travelPlanSchema.index({ source: 1, destination: 1 });

module.exports = mongoose.model('TravelPlan', travelPlanSchema);
