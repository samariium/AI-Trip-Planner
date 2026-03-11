import { useState } from 'react';

const ItineraryCard = ({ itinerary }) => {
  const [activeDay, setActiveDay] = useState(0);

  if (!itinerary?.length) return null;

  const day = itinerary[activeDay];

  return (
    <div className="itinerary-card">
      <div className="itinerary-tabs">
        {itinerary.map((d, i) => (
          <button
            key={i}
            className={`itinerary-tab ${i === activeDay ? 'active' : ''}`}
            onClick={() => setActiveDay(i)}
          >
            <span className="tab-day">Day {d.day}</span>
            <span className="tab-title">{d.title}</span>
          </button>
        ))}
      </div>

      <div className="itinerary-content">
        <div className="itinerary-slot morning">
          <div className="slot-header">
            <span className="slot-icon">🌅</span>
            <span className="slot-label">Morning</span>
            <span className="slot-time">8 AM – 12 PM</span>
          </div>
          <p className="slot-text">{day.morning}</p>
        </div>

        <div className="itinerary-slot afternoon">
          <div className="slot-header">
            <span className="slot-icon">☀️</span>
            <span className="slot-label">Afternoon</span>
            <span className="slot-time">12 PM – 5 PM</span>
          </div>
          <p className="slot-text">{day.afternoon}</p>
        </div>

        <div className="itinerary-slot evening">
          <div className="slot-header">
            <span className="slot-icon">🌙</span>
            <span className="slot-label">Evening</span>
            <span className="slot-time">5 PM – 10 PM</span>
          </div>
          <p className="slot-text">{day.evening}</p>
        </div>
      </div>
    </div>
  );
};

export default ItineraryCard;
