import OverviewCard from './OverviewCard';
import TravelOptions from './TravelOptions';
import MapView from './MapView';
import Attractions from './Attractions';
import LocalFoods from './LocalFoods';
import LocalContacts from './LocalContacts';
import TravelTips from './TravelTips';
import ItineraryCard from './ItineraryCard';
import BudgetCard from './BudgetCard';
import WeatherCard from './WeatherCard';

const TravelPlan = ({ data }) => {
  return (
    <div className="travel-plan">
      {/* Overview banner */}
      <OverviewCard data={data} />

      <div className="travel-plan-sections">
        {/* Weather */}
        <section>
          <h2 className="section-title">
            <span className="section-icon">🌤️</span>
            Weather at Destination
          </h2>
          <WeatherCard destination={data.destination} />
        </section>

        {/* Multi-Day Itinerary */}
        {data.itinerary?.length > 0 && (
          <section>
            <h2 className="section-title">
              <span className="section-icon">📅</span>
              3-Day Itinerary
            </h2>
            <ItineraryCard itinerary={data.itinerary} />
          </section>
        )}

        {/* Budget Estimator */}
        {data.budget && (
          <section>
            <h2 className="section-title">
              <span className="section-icon">💰</span>
              Budget Estimator
            </h2>
            <BudgetCard budget={data.budget} />
          </section>
        )}
        {/* Travel Options */}
        {data.travelOptions?.length > 0 && (
          <section>
            <h2 className="section-title">
              <span className="section-icon">✈️</span>
              Travel Options
            </h2>
            <TravelOptions options={data.travelOptions} />
          </section>
        )}

        {/* Route Map */}
        <section>
          <h2 className="section-title">
            <span className="section-icon">🗺️</span>
            Route Map
          </h2>
          <MapView
            sourceCoords={data.sourceCoords}
            destCoords={data.destCoords}
            source={data.source}
            destination={data.destination}
            attractions={data.attractions}
          />
        </section>

        {/* Attractions */}
        {data.attractions?.length > 0 && (
          <section>
            <h2 className="section-title">
              <span className="section-icon">🏛️</span>
              Top Attractions
            </h2>
            <Attractions attractions={data.attractions} />
          </section>
        )}

        {/* Local Foods */}
        {data.localFoods?.length > 0 && (
          <section>
            <h2 className="section-title">
              <span className="section-icon">🍜</span>
              Local Cuisine
            </h2>
            <LocalFoods foods={data.localFoods} />
          </section>
        )}

        {/* Local Contacts */}
        {data.localContacts?.length > 0 && (
          <section>
            <h2 className="section-title">
              <span className="section-icon">📞</span>
              Local Assistance
            </h2>
            <LocalContacts contacts={data.localContacts} />
          </section>
        )}

        {/* Travel Tips */}
        {data.travelTips?.length > 0 && (
          <section>
            <h2 className="section-title">
              <span className="section-icon">💡</span>
              Travel Tips
            </h2>
            <TravelTips tips={data.travelTips} />
          </section>
        )}
      </div>
    </div>
  );
};

export default TravelPlan;
