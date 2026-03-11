/**
 * Seed script — populates MongoDB with sample local contacts.
 * Run with: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const LocalContact = require('./models/LocalContact');

const SAMPLE_CONTACTS = [
  // Goa
  { destination: 'Goa', name: 'GoaTours & Travels', role: 'Tourist Guide', contactInfo: '+91-832-222-0101', description: 'Licensed guides covering North and South Goa beaches, spice farms, and heritage sites.', rating: 4.7, languages: ['English', 'Hindi', 'Konkani'], available: '8 AM - 8 PM', verified: true },
  { destination: 'Goa', name: 'Sunshine Cabs', role: 'Taxi Service', contactInfo: '+91-832-266-5500', description: 'Reliable AC taxi service with airport pickups and full-day hire options.', rating: 4.4, languages: ['English', 'Hindi'], available: '24/7', verified: true },
  { destination: 'Goa', name: 'Goa Tourism Office', role: 'Tourism Office', contactInfo: '+91-832-2437-132', description: 'Official Goa Tourism Development Corporation office for maps, guides, and assistance.', rating: 4.2, languages: ['English', 'Hindi', 'Konkani'], available: '10 AM - 5 PM', verified: true },
  { destination: 'Goa', name: 'Goa Medical College Hospital', role: 'Hospital', contactInfo: '+91-832-2458-726', description: '24-hour emergency services and general healthcare.', rating: 4.0, languages: ['English', 'Hindi', 'Konkani'], available: '24/7', verified: true },
  { destination: 'Goa', name: 'Goa Police Emergency', role: 'Emergency', contactInfo: '100', description: 'Goa Police emergency helpline. Dial 100 for immediate assistance.', languages: ['English', 'Hindi', 'Konkani'], available: '24/7', verified: true },

  // Delhi
  { destination: 'Delhi', name: 'Delhi Heritage Walks', role: 'Tourist Guide', contactInfo: '+91-11-2338-4444', description: 'Expert-guided heritage walks through Old Delhi, Lutyens Delhi, and Mughal monuments.', rating: 4.8, languages: ['English', 'Hindi', 'French'], available: '7 AM - 7 PM', verified: true },
  { destination: 'Delhi', name: 'Ola / Uber Delhi', role: 'Taxi Service', contactInfo: 'App-based booking', description: 'Reliable app-based cab services operating throughout Delhi NCR.', rating: 4.3, languages: ['Hindi', 'English'], available: '24/7', verified: true },
  { destination: 'Delhi', name: 'Delhi Tourism Corporation', role: 'Tourism Office', contactInfo: '+91-11-2336-5358', description: 'Official tourism office at N-Block, Connaught Place. Maps, tours, and travel info.', rating: 4.1, languages: ['English', 'Hindi'], available: '9 AM - 6 PM', verified: true },
  { destination: 'Delhi', name: 'AIIMS Emergency', role: 'Hospital', contactInfo: '+91-11-2658-8500', description: 'All India Institute of Medical Sciences — top-tier emergency and trauma care.', languages: ['English', 'Hindi'], available: '24/7', verified: true },
  { destination: 'Delhi', name: 'Delhi Police Emergency', role: 'Emergency', contactInfo: '100', description: 'Delhi Police emergency helpline. Also reachable at 112 (national emergency).', languages: ['Hindi', 'English'], available: '24/7', verified: true },

  // Mumbai
  { destination: 'Mumbai', name: 'Mumbai DarshanTours', role: 'Tourist Guide', contactInfo: '+91-22-2202-6713', description: 'MTDC-approved guides for Mumbai sightseeing including Marine Drive, Colaba, and Dharavi.', rating: 4.6, languages: ['English', 'Hindi', 'Marathi'], available: '8 AM - 9 PM', verified: true },
  { destination: 'Mumbai', name: 'Meru Cabs Mumbai', role: 'Taxi Service', contactInfo: '+91-22-4422-4422', description: 'Professional radio taxi service with metered fares across Mumbai.', rating: 4.2, languages: ['Hindi', 'Marathi', 'English'], available: '24/7', verified: true },
  { destination: 'Mumbai', name: 'MTDC Tourism Office', role: 'Tourism Office', contactInfo: '+91-22-2202-6713', description: 'Maharashtra Tourism Development Corporation at Madame Cama Road, Nariman Point.', rating: 4.3, languages: ['English', 'Hindi', 'Marathi'], available: '10 AM - 5 PM', verified: true },
  { destination: 'Mumbai', name: 'KEM Hospital Emergency', role: 'Hospital', contactInfo: '+91-22-2410-7000', description: 'King Edward Memorial Hospital — major public hospital with 24/7 emergency services.', languages: ['Hindi', 'Marathi', 'English'], available: '24/7', verified: true },
  { destination: 'Mumbai', name: 'Mumbai Police Emergency', role: 'Emergency', contactInfo: '100', description: 'Mumbai Police emergency line. Alternatively call 112 for all emergencies.', languages: ['Hindi', 'Marathi', 'English'], available: '24/7', verified: true },

  // Paris
  { destination: 'Paris', name: 'Paris City Tours', role: 'Tourist Guide', contactInfo: '+33-1-4626-2600', description: 'Multilingual licensed guides for Eiffel Tower, Louvre, and Montmartre walking tours.', rating: 4.9, languages: ['English', 'French', 'Spanish', 'German'], available: '9 AM - 8 PM', verified: true },
  { destination: 'Paris', name: 'G7 Taxis Paris', role: 'Taxi Service', contactInfo: '+33-1-4739-4739', description: 'France\'s largest taxi operator with app booking and airport transfers.', rating: 4.5, languages: ['French', 'English'], available: '24/7', verified: true },
  { destination: 'Paris', name: 'Office du Tourisme de Paris', role: 'Tourism Office', contactInfo: '+33-1-4952-4252', description: 'Paris official tourism office at Pyramides — maps, museum passes, and bookings.', rating: 4.6, languages: ['English', 'French', 'Spanish'], available: '10 AM - 7 PM', verified: true },
  { destination: 'Paris', name: 'Hôtel-Dieu Hospital', role: 'Hospital', contactInfo: '+33-1-4234-8200', description: 'Central Paris hospital near Notre-Dame. 24-hour emergency department.', languages: ['French', 'English'], available: '24/7', verified: true },
  { destination: 'Paris', name: 'Police/Emergency France', role: 'Emergency', contactInfo: '17', description: 'French Police emergency number. Dial 15 for medical, 18 for fire, 112 for all EU emergencies.', languages: ['French', 'English'], available: '24/7', verified: true }
];

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-trip';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    await LocalContact.deleteMany({});
    console.log('🗑️  Cleared existing contacts');

    const inserted = await LocalContact.insertMany(SAMPLE_CONTACTS);
    console.log(`✅ Inserted ${inserted.length} sample contacts`);

    await mongoose.disconnect();
    console.log('✅ Done! Database seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
