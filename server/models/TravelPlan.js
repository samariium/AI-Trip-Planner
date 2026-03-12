const mongoose = require('mongoose');

const travelPlanSchema = new mongoose.Schema(
  {
    source: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    days: { type: Number, default: 3 },
    startDate: { type: String },
    endDate: { type: String },
    travellerType: { type: String, default: 'solo' },
    budgetLevel: { type: String, default: 'midrange' },
    tripPurpose: { type: String, default: 'cultural' },
    numTravellers: { type: Number, default: 1 },
    packingChecklist: [mongoose.Schema.Types.Mixed],
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
    hotels: [mongoose.Schema.Types.Mixed],
    restaurants: [mongoose.Schema.Types.Mixed],
    nearbyDestinations: [mongoose.Schema.Types.Mixed],
    visaInfo: { type: mongoose.Schema.Types.Mixed },
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

// Compound index for fast lookups (includes preferences for cache correctness)
travelPlanSchema.index({ source: 1, destination: 1, days: 1, travellerType: 1, budgetLevel: 1, tripPurpose: 1 });

module.exports = mongoose.model('TravelPlan', travelPlanSchema);
