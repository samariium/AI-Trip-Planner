const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ─── Shared prompt builder ────────────────────────────────────────────────────
const buildItineraryTemplate = (destination, days) => {
  const arr = [];
  for (let i = 1; i <= days; i++) {
    let title;
    if (i === 1) title = `Arrival & First Impressions of ${destination}`;
    else if (i === days) title = `Final Day & Departure from ${destination}`;
    else title = `Day ${i} — Exploring ${destination}`;
    arr.push(`    {\n      "day": ${i},\n      "title": "${title}",\n      "morning": "Specific morning activities in ${destination} for day ${i} (8AM–12PM)",\n      "afternoon": "Specific afternoon activities in ${destination} for day ${i} (12PM–5PM)",\n      "evening": "Specific evening activities or dining in ${destination} for day ${i} (5PM–10PM)"\n    }`);
  }
  return arr.join(',\n');
};

const buildPrompt = (source, destination, startDate, endDate, days = 3) => {
  const dateContext = startDate && endDate
    ? `The trip runs from ${startDate} to ${endDate} (${days} day${days !== 1 ? 's' : ''}).`
    : `The trip is ${days} day${days !== 1 ? 's' : ''} long.`;
  return `
You are an expert travel assistant. Generate a HIGHLY ACCURATE and SPECIFIC travel guide for a journey from "${source}" to "${destination}".
${dateContext}

Return ONLY a valid JSON object with EXACTLY this structure — no markdown, no code fences, no extra text:
{
  "overview": "2-3 sentence engaging and accurate overview specific to traveling from ${source} to ${destination}",
  "bestTimeToVisit": "specific best months/seasons to visit ${destination} with reason",
  "localLanguage": "primary language(s) spoken in ${destination}",
  "currency": "currency name and ISO code used in ${destination}, e.g. Indian Rupee (INR)",
  "travelOptions": [
    {
      "mode": "exact mode name e.g. Flight / Train / Bus / Road",
      "duration": "realistic travel time from ${source} to ${destination}",
      "estimatedCost": "realistic price range in relevant currency",
      "details": "specific, accurate details about this travel option for this exact route",
      "pros": "actual advantage of this mode for this route",
      "cons": "actual disadvantage of this mode for this route",
      "bookingTip": "specific advice on booking platforms or operators for this route"
    }
  ],
  "attractions": [
    {
      "name": "real attraction name in ${destination}",
      "description": "accurate 2-3 sentence description of this actual place",
      "category": "Historical|Nature|Religious|Entertainment|Shopping|Art|Beach|Adventure",
      "visitDuration": "realistic time needed",
      "entryFee": "accurate entry fee or Free",
      "bestTime": "best time of day/year to visit this specific place"
    }
  ],
  "localFoods": [
    {
      "name": "real dish name from ${destination} region",
      "description": "accurate 2-3 sentence description of this dish and its local significance",
      "type": "Breakfast|Lunch|Dinner|Snack|Dessert|Beverage|Street Food",
      "mustTry": true,
      "where": "specific streets, markets or restaurant names in ${destination} where it's found",
      "priceRange": "realistic price range in local currency"
    }
  ],
  "localContacts": [
    {
      "role": "Tourist Guide|Taxi Service|Homestay|Emergency|Hospital|Police|Tourism Office",
      "name": "real organisation/service name in ${destination}",
      "description": "accurate description of this service",
      "contactInfo": "real phone number or address for ${destination}",
      "available": "accurate availability hours"
    }
  ],
  "travelTips": [
    "specific practical tip 1 for this route/destination",
    "specific practical tip 2",
    "specific practical tip 3",
    "specific practical tip 4",
    "specific practical tip 5",
    "specific practical tip 6"
  ],
  "itinerary": [
${buildItineraryTemplate(destination, days)}
  ],
  "budget": {
    "accommodation": {
      "budget": "price per night for budget stays in ${destination} (hostels/guesthouses)",
      "midRange": "price per night for mid-range hotels in ${destination}",
      "luxury": "price per night for luxury hotels in ${destination}"
    },
    "food": {
      "budget": "daily food budget for budget traveller in ${destination}",
      "midRange": "daily mid-range food cost in ${destination}",
      "luxury": "daily fine-dining cost in ${destination}"
    },
    "localTransport": "typical daily local transport cost in ${destination} (auto/bus/metro)",
    "attractions": "average combined entry fees for major attractions in ${destination}",
    "totalPerDay": {
      "budget": "total all-inclusive daily cost for budget traveller in ${destination}",
      "midRange": "total all-inclusive daily cost for mid-range traveller",
      "luxury": "total all-inclusive daily cost for luxury traveller"
    }
  }
}

CRITICAL REQUIREMENTS:
- ALL attractions must be REAL places that exist in ${destination}
- ALL foods must be REAL local dishes actually eaten in ${destination} or its region
- ALL contact info must be real, accurate numbers/addresses for ${destination}
- Travel options must reflect the ACTUAL route from ${source} to ${destination} with realistic durations and costs
- Itinerary activities must reference REAL landmarks from the attractions list
- Budget figures must use the correct local currency for ${destination}
- Include 3-4 travel options, exactly 6 attractions, exactly 6 foods, 5-6 contacts
- Generate EXACTLY ${days} itinerary days matching the trip duration
- Be specific — no generic placeholder text
`.trim();
};

// ─── Groq (Free: 14,400 req/day, 30 req/min — primary provider) ──────────────
const generateWithGroq = async (source, destination, startDate, endDate, days) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your-groq-api-key-here') return null;

  const groq = new Groq({ apiKey });
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You are an expert travel assistant. Return ONLY valid JSON — no markdown, no code blocks, no extra text.' },
      { role: 'user', content: buildPrompt(source, destination, startDate, endDate, days) }
    ],
    temperature: 0.7,
    max_tokens: 4096,
    response_format: { type: 'json_object' }
  });
  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response from Groq');
  return JSON.parse(content);
};

// ─── Google Gemini (fallback) ─────────────────────────────────────────────────
const generateWithGemini = async (source, destination, startDate, endDate, days) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-api-key-here') return null;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-lite',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 4096
    }
  });

  const result = await model.generateContent(buildPrompt(source, destination, startDate, endDate, days));
  const text = result.response.text();
  return JSON.parse(text);
};

// ─── Main entry point ─────────────────────────────────────────────────────────
const generateTravelPlan = async (source, destination, startDate, endDate, days = 3) => {

  // 1️⃣ Try Groq (free, fast, 14,400 req/day)
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your-groq-api-key-here') {
    try {
      console.log(`[AI] Using Groq for: ${source} → ${destination} (${days} days)`);
      const plan = await generateWithGroq(source, destination, startDate, endDate, days);
      if (plan) return plan;
    } catch (err) {
      console.warn(`[AI] Groq failed (${err.message}), trying Gemini...`);
    }
  }

  // 2️⃣ Try Google Gemini
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
    try {
      console.log(`[AI] Using Gemini for: ${source} → ${destination} (${days} days)`);
      const plan = await generateWithGemini(source, destination, startDate, endDate, days);
      if (plan) return plan;
    } catch (err) {
      console.warn(`[AI] Gemini failed (${err.message}), using template fallback...`);
    }
  }

  // 3️⃣ Template fallback
  console.warn(`[AI] No AI provider available — using template for: ${source} → ${destination}`);
  return generateFallbackPlan(source, destination);
};

// ─── Fallback Plan Generator ──────────────────────────────────────────────────
const generateFallbackPlan = (source, destination) => {
  const dst = destination;
  const src = source;

  return {
    overview: `${dst} is a fascinating destination waiting to be explored from ${src}. Whether you prefer historical landmarks, vibrant local culture, or scenic natural beauty, ${dst} has something for every traveller. This guide covers the best ways to get there, what to see, what to eat, and who to call for help.`,
    bestTimeToVisit: 'October to March (pleasant weather, ideal for sightseeing)',
    localLanguage: 'Local regional language & English widely understood in tourist areas',
    currency: 'Check XE.com for the latest exchange rate before travelling',
    aiNote: `⚠️ This plan was generated using our built-in template because the AI service is temporarily unavailable. Please try again shortly.`,

    travelOptions: [
      {
        mode: 'Flight',
        duration: '1–3 hours (varies by distance)',
        estimatedCost: '$50–$300 (economy)',
        details: `Search for direct or connecting flights from ${src} to the nearest airport to ${dst}. Book 3–6 weeks in advance for the best fares.`,
        pros: 'Fastest option, comfortable for long distances',
        cons: 'Expensive, airport check-in takes extra time',
        bookingTip: 'Compare fares on Google Flights, Skyscanner, or MakeMyTrip. Enable price alerts.'
      },
      {
        mode: 'Train',
        duration: '3–12 hours (varies by route)',
        estimatedCost: '$15–$80',
        details: `Trains offer a comfortable, scenic journey between ${src} and ${dst}. Book express or superfast trains for the quickest option.`,
        pros: 'Affordable, scenic, spacious seating, city-centre stations',
        cons: 'Slower than flying, limited availability on some routes',
        bookingTip: 'Book on the official national rail website up to 90 days in advance. Choose AC/sleeper for overnight journeys.'
      },
      {
        mode: 'Bus',
        duration: '4–14 hours (varies by route)',
        estimatedCost: '$5–$30',
        details: `Luxury AC bus services operate between ${src} and ${dst}. Good budget option with door-to-door convenience.`,
        pros: 'Cheapest option, flexible departure times, no advance booking needed',
        cons: 'Slowest mode, comfort varies by operator',
        bookingTip: 'Use redBus, Abhibus, or local operators. Choose sleeper or semi-sleeper for overnight comfort.'
      },
      {
        mode: 'Car / Road Trip',
        duration: 'Self-drive or taxi (check Google Maps for exact time)',
        estimatedCost: 'Fuel + tolls, or $40–$120 for a taxi',
        details: `A road trip from ${src} to ${dst} gives you maximum flexibility to stop at scenic spots along the way.`,
        pros: 'Complete freedom, door-to-door, great for groups',
        cons: 'Tiring for long distances, parking and toll costs add up',
        bookingTip: 'Use Google Maps to plan stops. Book an Ola/Uber outstation cab for a hassle-free ride.'
      }
    ],

    attractions: [
      {
        name: `${dst} City Centre`,
        description: `The heart of ${dst}, buzzing with shops, eateries, and local life. A great starting point for any visit to understand the city's character and energy.`,
        category: 'Entertainment',
        visitDuration: '2–3 hours',
        entryFee: 'Free',
        bestTime: 'Morning or evening'
      },
      {
        name: 'Historic Old Quarter',
        description: `Wander through the historic old quarter to discover architecture, temples, and bazaars that tell centuries of stories. This area best captures the cultural soul of ${dst}.`,
        category: 'Historical',
        visitDuration: '3–4 hours',
        entryFee: 'Free (some monuments may charge ₹20–₹200)',
        bestTime: 'Early morning to avoid crowds'
      },
      {
        name: 'Local Nature Park / Viewpoint',
        description: `A scenic park or hilltop viewpoint offering panoramic views over ${dst}. Popular with locals for morning walks and picnics.`,
        category: 'Nature',
        visitDuration: '1–2 hours',
        entryFee: 'Free or nominal fee',
        bestTime: 'Sunrise or sunset'
      },
      {
        name: 'Religious / Cultural Site',
        description: `A significant temple, mosque, church, or cultural monument that is central to the spiritual and community life of ${dst}. Dress modestly and remove shoes when required.`,
        category: 'Religious',
        visitDuration: '1 hour',
        entryFee: 'Free (donations welcome)',
        bestTime: 'Morning or during festival season'
      },
      {
        name: 'Local Market / Bazaar',
        description: `Experience the authentic colours, smells, and sounds of a traditional market in ${dst}. Perfect for picking up local crafts, spices, and souvenirs at reasonable prices.`,
        category: 'Shopping',
        visitDuration: '1–2 hours',
        entryFee: 'Free',
        bestTime: 'Weekday mornings for fewer crowds'
      },
      {
        name: 'Museum or Art Gallery',
        description: `Explore the regional history, art, and heritage of ${dst} at the city museum or gallery. Exhibits offer fascinating insights into local culture that you won't find in guidebooks.`,
        category: 'Art',
        visitDuration: '1–2 hours',
        entryFee: '₹20–₹100 approx.',
        bestTime: 'Afternoon'
      }
    ],

    localFoods: [
      {
        name: 'Regional Thali / Set Meal',
        description: `A traditional spread of local dishes served on a single plate, offering the full flavour profile of ${dst}'s cuisine. Each region has its own unique combination of curries, breads, rice, and condiments.`,
        type: 'Lunch',
        mustTry: true,
        where: 'Local dhaba-style restaurants or heritage food streets',
        priceRange: '₹80–₹250'
      },
      {
        name: 'Street Chaat / Snacks',
        description: `The street food scene in ${dst} is legendary. Look for local chaat, bhajji stalls, and fried snacks that burst with flavour. Follow the vendor with the longest queue for the best quality.`,
        type: 'Street Food',
        mustTry: true,
        where: 'Evening food markets and busy street corners',
        priceRange: '₹20–₹60'
      },
      {
        name: 'Local Sweet / Mithai',
        description: `Every Indian city has its signature sweet. In ${dst}, try the freshly made local mithai from an old-school sweet shop — perfect as a souvenir or evening treat.`,
        type: 'Dessert',
        mustTry: true,
        where: 'Old-city halwai shops and sweet stalls',
        priceRange: '₹30–₹100 per 100g'
      },
      {
        name: 'Fresh Lassi / Local Drink',
        description: `A chilled lassi (yoghurt drink) or locally brewed herbal tea is the perfect way to beat the heat and refresh after a long day of sightseeing in ${dst}.`,
        type: 'Beverage',
        mustTry: true,
        where: 'Roadside stalls near tourist areas',
        priceRange: '₹20–₹50'
      },
      {
        name: 'Biryani or Local Rice Dish',
        description: `Aromatic, slow-cooked rice layered with spices and protein. The biryani or local rice preparation in ${dst} is a must for any food lover visiting the region.`,
        type: 'Dinner',
        mustTry: true,
        where: 'Popular family restaurants and old-city eateries',
        priceRange: '₹120–₹350'
      },
      {
        name: 'Morning Breakfast Special',
        description: `Start your day like a local with the region's traditional breakfast — whether it's poha, idli, paratha, or something unique to ${dst}. Best enjoyed fresh and hot from a neighbourhood canteen.`,
        type: 'Breakfast',
        mustTry: false,
        where: 'Local neighbourhood canteens, open from 7 AM',
        priceRange: '₹40–₹100'
      }
    ],

    localContacts: [
      {
        role: 'Tourism Office',
        name: `${dst} Tourism Information Centre`,
        description: `The official tourism office provides maps, guided tour bookings, accommodation lists, and travel advice for visitors to ${dst}.`,
        contactInfo: 'Visit the main railway station or city centre — look for the Government Tourism booth',
        available: '9 AM – 6 PM (Mon–Sat)'
      },
      {
        role: 'Tourist Guide',
        name: 'Licensed Local Guide Association',
        description: `Hire a government-approved guide for deeper insights into ${dst}'s history and culture. Guides are available at major monuments and the tourism office.`,
        contactInfo: 'Ask at the main tourist monuments or your hotel concierge',
        available: '8 AM – 7 PM'
      },
      {
        role: 'Taxi Service',
        name: 'Ola / Uber / Rapido',
        description: `App-based cab services are available in most cities in India. For outstation travel, book an "Outstation" ride. Auto-rickshaws are great for short distances.`,
        contactInfo: 'Download the Ola or Uber app and enable location access',
        available: '24/7'
      },
      {
        role: 'Emergency',
        name: 'National Emergency Helpline',
        description: 'Dial 112 for all emergencies in India — connects to police, fire, and ambulance services.',
        contactInfo: '112',
        available: '24/7'
      },
      {
        role: 'Hospital',
        name: 'District Government Hospital',
        description: `The nearest government hospital to ${dst} city centre provides 24-hour emergency services and general healthcare at low cost.`,
        contactInfo: 'Ask your hotel for the nearest hospital address, or search "hospital near me"',
        available: '24/7'
      },
      {
        role: 'Police',
        name: 'Local Police Station',
        description: 'For non-emergency assistance, report to the nearest police station. For FIR, passport loss, or tourist complaints, tourist police desks are available in major cities.',
        contactInfo: '100 (Police) | 1090 (Tourist Helpline)',
        available: '24/7'
      }
    ],

    travelTips: [
      `Always carry a printed copy of your hotel address and phone number in ${dst} in case your phone battery dies.`,
      `Use Google Maps offline — download the ${dst} map before you travel so it works without data.`,
      `Keep small denomination notes (₹10–₹100) handy for auto-rickshaws, street food, and temple donations.`,
      `Drink only bottled or filtered water, especially at street-side stalls, to avoid stomach issues.`,
      `Respect local dress codes when visiting religious sites — carry a scarf or stole in your bag.`,
      `Always agree on the fare before getting into an auto-rickshaw, or insist on using the meter.`
    ],

    itinerary: [
      {
        day: 1,
        title: `Arrival & Discovery — Welcome to ${dst}`,
        morning: `Arrive in ${dst}, check into your accommodation, and freshen up. Take a short orientation walk around the neighbourhood to get your bearings.`,
        afternoon: `Head to the city centre and explore the main landmarks. Visit the local market or old quarter for an authentic first taste of ${dst}'s culture.`,
        evening: `Enjoy dinner at a popular local restaurant. Try the regional specialties, then take an evening stroll along the main promenade or waterfront.`
      },
      {
        day: 2,
        title: `History & Culture Deep-Dive in ${dst}`,
        morning: `Early morning visit to the most famous historical or religious site in ${dst}. Arrive before 9 AM to beat the crowds and take great photos.`,
        afternoon: `Visit the local museum or cultural centre. Have lunch at a restaurant recommended by locals — ask your hotel for their favourite spot.`,
        evening: `Explore the bazaar or shopping district. Pick up souvenirs and local handicrafts, then enjoy dinner at a rooftop restaurant with city views.`
      },
      {
        day: 3,
        title: `Hidden Gems & Farewell from ${dst}`,
        morning: `Visit a scenic park, viewpoint or nature spot near ${dst}. Enjoy a leisurely breakfast at a local street café while watching daily life unfold.`,
        afternoon: `Final sightseeing round for any missed spots, or a relaxed session at a local café. Check out of accommodation and organise your luggage.`,
        evening: `Head to the transport terminal for your homeward journey. Safe travels and wonderful memories from ${dst}!`
      }
    ],

    budget: {
      accommodation: {
        budget: '₹600–₹1,500/night (hostels, budget guesthouses)',
        midRange: '₹2,000–₹5,000/night (3-star hotels)',
        luxury: '₹8,000–₹25,000+/night (5-star resorts)'
      },
      food: {
        budget: '₹200–₹450/day (street food & local dhabas)',
        midRange: '₹700–₹1,400/day (mid-range restaurants)',
        luxury: '₹2,500–₹6,000+/day (fine dining)'
      },
      localTransport: '₹150–₹400/day (auto-rickshaw, bus, metro)',
      attractions: '₹200–₹600/day (average combined entry fees)',
      totalPerDay: {
        budget: '₹1,200–₹2,500/day',
        midRange: '₹3,500–₹8,000/day',
        luxury: '₹12,000–₹35,000+/day'
      }
    }
  };
};

module.exports = { generateTravelPlan };
