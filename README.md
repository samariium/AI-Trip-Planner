# ✈️ AI Trip Planner

An AI-powered travel planning platform that combines route planning, tourism guidance, food recommendations, and local support in one place.

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
