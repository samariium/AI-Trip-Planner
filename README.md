# ✈️ AI Trip Planner

An AI-powered travel planning platform that generates complete trip guides — routes, attractions, food, budget, itinerary, and local contacts — for any source and destination.

🌐 **Live Demo:** [samariium.github.io/AI-Trip-Planner](https://samariium.github.io/AI-Trip-Planner)

---

## 🌟 Features

- 🤖 **AI-Generated Travel Plans** — Groq (Llama 3.3 70B) primary, Gemini 2.0 Flash fallback, template as last resort
- 📅 **Date Range Picker** — Choose departure & return dates; itinerary dynamically adjusts to trip duration
- ✈️ **Smart Travel Options** — Flights, trains, buses, road routes with cost estimates
- 🗺️ **Interactive Route Maps** — Leaflet maps with road-following OSRM routing and clickable attraction pins
- 🏛️ **Top Attractions** — Must-visit landmarks with category emojis, duration, and entry fees
- 🍜 **Local Cuisine Guide** — Authentic food recommendations and where to find them
- 📅 **Day-by-Day Itinerary** — AI-generated schedule matching your exact trip length
- 💰 **Budget Breakdown** — Budget / mid-range / luxury estimates per day
- 📞 **Local Assistance Contacts** — Guides, taxis, emergency numbers, hospitals
- 🌙 **Dark / Light Mode** — Fully themed UI with persistent preference
- 🕐 **Recently Searched** — Quick re-run of past trips from localStorage
- 💾 **Smart Caching** — MongoDB caches plans by route + days (24h TTL)

---

## 🛠️ Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18 + Vite, deployed to GitHub Pages |
| Backend    | Node.js + Express, deployed to Render |
| Database   | MongoDB Atlas + Mongoose |
| AI (primary) | Groq — `llama-3.3-70b-versatile` (free, 14,400 req/day) |
| AI (fallback) | Google Gemini — `gemini-2.0-flash-lite` |
| Maps       | Leaflet.js + OpenStreetMap + Nominatim geocoding |
| Routing    | OSRM (open-source, no key needed) |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Gemini API key (free at [aistudio.google.com](https://aistudio.google.com)) — optional fallback

### 1. Clone & Install

```bash
git clone https://github.com/samariium/AI-Trip-Planner.git
cd AI-Trip-Planner

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ai-trip
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Run the App

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deployment

### Frontend → GitHub Pages
```bash
cd client
npm run deploy
```

### Backend → Render
- Connect GitHub repo at [render.com](https://render.com)
- Root directory: `server` | Build: `npm install` | Start: `node server.js`
- Add environment variables in Render dashboard (same as `.env` above, plus `MONGODB_URI` from Atlas)

---

## 📁 Project Structure

```
AI-Trip-Planner/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          # Nav + theme toggle
│   │   │   ├── SearchForm.jsx      # From/To + date range picker
│   │   │   ├── TravelPlan.jsx      # Main results container
│   │   │   ├── OverviewCard.jsx    # Trip overview
│   │   │   ├── TravelOptions.jsx   # Flight/train/bus cards
│   │   │   ├── MapView.jsx         # Leaflet map + OSRM routing
│   │   │   ├── Attractions.jsx     # Attraction cards
│   │   │   ├── LocalFoods.jsx      # Food recommendations
│   │   │   ├── ItineraryCard.jsx   # Day-by-day schedule
│   │   │   ├── BudgetCard.jsx      # Budget breakdown
│   │   │   ├── TravelTips.jsx      # Travel tips
│   │   │   ├── LocalContacts.jsx   # Emergency contacts
│   │   │   ├── WeatherCard.jsx     # Weather info
│   │   │   └── LoadingSpinner.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Full dark/light theme
│   ├── .env.production         # VITE_API_URL (gitignored)
│   ├── vite.config.js
│   └── package.json
│
├── server/                    # Node.js + Express backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   └── TravelPlan.js      # Schema with TTL + compound index
│   ├── routes/
│   │   └── travel.js
│   ├── controllers/
│   │   └── travelController.js
│   ├── services/
│   │   ├── aiService.js       # Groq → Gemini → template fallback
│   │   └── mapsService.js     # Nominatim geocoding
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🔑 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/travel/plan` | Generate AI travel plan |
| GET | `/api/health` | Server health check |

### POST `/api/travel/plan`
```json
{
  "source": "Mumbai",
  "destination": "Goa",
  "startDate": "2026-03-13",
  "endDate": "2026-03-16",
  "days": 3
}
```

---

## 🌐 Free APIs Used

- **OpenStreetMap / Nominatim** — Geocoding (no key needed)
- **OSRM** — Road routing (no key needed)
- **Groq** — AI inference, free tier (API key required)
- **Google Gemini** — AI fallback, free tier (API key required)

---

## 📝 License

MIT


## 🌟 Features

- 🤖 **AI-Generated Travel Plans** — GPT-4o-mini powered recommendations for any route
- ✈️ **Smart Travel Options** — Flights, trains, buses, and road routes with cost estimates
- 🗺️ **Interactive Route Maps** — Real-time Leaflet maps with OpenStreetMap routing
- 🏛️ **Top Attractions** — Must-visit landmarks and hidden gems at your destination
- 🍜 **Local Cuisine Guide** — Authentic food recommendations and where to find them
- 📞 **Local Assistance Contacts** — Guides, taxi services, emergency contacts, and more
- 💾 **Smart Caching** — MongoDB caches plans for 24 hours for fast repeat queries

## 🛠️ Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18 + Vite |
| Backend    | Node.js + Express |
| Database   | MongoDB + Mongoose |
| AI         | OpenAI GPT-4o-mini |
| Maps       | Leaflet.js + OpenStreetMap + Nominatim |
| Routing    | OSRM (free, open-source) |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API Key

### 1. Clone & Setup

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

```bash
# In the server directory, create a .env file:
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-trip
OPENAI_API_KEY=sk-your-openai-api-key-here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Seed Sample Data (Optional)

```bash
cd server
npm run seed
```

### 4. Run the Application

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
AI TRIP/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Header.jsx
│   │   │   ├── SearchForm.jsx
│   │   │   ├── TravelPlan.jsx
│   │   │   ├── OverviewCard.jsx
│   │   │   ├── TravelOptions.jsx
│   │   │   ├── MapView.jsx
│   │   │   ├── Attractions.jsx
│   │   │   ├── LocalFoods.jsx
│   │   │   ├── LocalContacts.jsx
│   │   │   ├── TravelTips.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                    # Node.js + Express backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── LocalContact.js    # Contact schema
│   │   └── TravelPlan.js      # Cached plan schema
│   ├── routes/
│   │   ├── travel.js
│   │   └── contacts.js
│   ├── controllers/
│   │   ├── travelController.js
│   │   └── contactsController.js
│   ├── services/
│   │   ├── aiService.js       # OpenAI integration
│   │   └── mapsService.js     # Nominatim geocoding
│   ├── server.js
│   ├── seed.js                # Sample data seeder
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 🔑 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/travel/plan` | Generate an AI travel plan |
| GET | `/api/contacts/:destination` | Get local contacts for a city |
| POST | `/api/contacts` | Add a new local contact |
| GET | `/api/health` | Server health check |

### POST `/api/travel/plan`
```json
{
  "source": "Mumbai",
  "destination": "Goa"
}
```

## 🌐 Free APIs Used

- **OpenStreetMap / Nominatim** — Geocoding (no key needed)
- **OSRM** — Road routing (no key needed)
- **OpenAI GPT-4o-mini** — AI recommendations (API key required)

## 📝 License

MIT
