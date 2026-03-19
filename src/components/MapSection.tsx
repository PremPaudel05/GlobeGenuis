import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Sun, CloudRain, DollarSign, PartyPopper } from 'lucide-react';

interface MapSectionProps {
  mapData: {
    countryQuery: string;
    cities: {
      name: string;
      query: string;
      highlights: string[];
    }[];
    bestBeaches?: string[];
    bestFoodAreas?: string[];
    nightlifeZones?: string[];
    instagrammableSpots?: string[];
    areasToAvoid?: string[];
  };
  bestTimeToVisit?: {
    bestMonths: string;
    rainySeason: string;
    cheapestSeason: string;
    majorFestivals: string[];
  };
}

export function MapSection({ mapData, bestTimeToVisit }: MapSectionProps) {
  const [currentQuery, setCurrentQuery] = useState(mapData.countryQuery);
  const [zoom, setZoom] = useState(5);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCityClick = (city: typeof mapData.cities[0]) => {
    setCurrentQuery(city.query);
    setZoom(10);
    setActiveCity(city.name);
    setActiveCategory(null);
  };

  const handleReset = () => {
    setCurrentQuery(mapData.countryQuery);
    setZoom(5);
    setActiveCity(null);
    setActiveCategory(null);
  };

  const handleCategoryClick = (category: string, querySuffix: string) => {
    setCurrentQuery(`${mapData.countryQuery} ${querySuffix}`);
    setZoom(6);
    setActiveCity(null);
    setActiveCategory(category);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <MapPin className="text-blue-600" />
          Interactive Map
        </h2>
        <p className="text-slate-500 text-sm mt-1">Explore major cities and regions.</p>
      </div>

      <div className="p-6 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 flex flex-col gap-3">
          <button
            onClick={handleReset}
            className={`text-left px-4 py-3 rounded-xl transition-all ${
              activeCity === null
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="font-medium">Country View</div>
          </button>
          
          {mapData.cities.map((city) => (
            <button
              key={city.name}
              onClick={() => handleCityClick(city)}
              className={`text-left px-4 py-3 rounded-xl transition-all ${
                activeCity === city.name
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="font-medium">{city.name}</div>
              {activeCity === city.name && (
                <motion.ul 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 space-y-1 text-sm text-blue-100 list-disc list-inside"
                >
                  {city.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </motion.ul>
              )}
            </button>
          ))}
        </div>

        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <div className="h-[400px] rounded-xl overflow-hidden bg-slate-100 relative shadow-inner">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${encodeURIComponent(currentQuery)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {[
              { id: 'beaches', label: '🏖 Best Beaches', data: mapData.bestBeaches, query: 'best beaches' },
              { id: 'food', label: '🍽 Best Food Areas', data: mapData.bestFoodAreas, query: 'best food areas' },
              { id: 'nightlife', label: '🎉 Nightlife Zones', data: mapData.nightlifeZones, query: 'nightlife' },
              { id: 'instagram', label: '📸 Most Instagrammable Spots', data: mapData.instagrammableSpots, query: 'instagrammable spots' },
              { id: 'avoid', label: '⚠️ Areas to Avoid', data: mapData.areasToAvoid, query: 'areas to avoid' },
            ].map((cat) => cat.data && cat.data.length > 0 && cat.data[0] !== "" && (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id, cat.query)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {activeCategory && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-2"
            >
              <h4 className="font-medium text-blue-900 mb-2 capitalize">
                {activeCategory.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                {activeCategory === 'beaches' && mapData.bestBeaches?.map((item, i) => <li key={i}>{item}</li>)}
                {activeCategory === 'food' && mapData.bestFoodAreas?.map((item, i) => <li key={i}>{item}</li>)}
                {activeCategory === 'nightlife' && mapData.nightlifeZones?.map((item, i) => <li key={i}>{item}</li>)}
                {activeCategory === 'instagram' && mapData.instagrammableSpots?.map((item, i) => <li key={i}>{item}</li>)}
                {activeCategory === 'avoid' && mapData.areasToAvoid?.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </motion.div>
          )}
        </div>
      </div>

      {bestTimeToVisit && (
        <div className="border-t border-slate-100 p-6 bg-slate-50/50">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
            <Calendar className="text-blue-600 w-5 h-5" />
            Best Time To Visit
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-amber-500 font-medium">
                <Sun className="w-5 h-5" />
                Best Months
              </div>
              <p className="text-slate-700 text-sm">{bestTimeToVisit.bestMonths}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-blue-500 font-medium">
                <CloudRain className="w-5 h-5" />
                Rainy Season
              </div>
              <p className="text-slate-700 text-sm">{bestTimeToVisit.rainySeason}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-emerald-500 font-medium">
                <DollarSign className="w-5 h-5" />
                Cheapest Season
              </div>
              <p className="text-slate-700 text-sm">{bestTimeToVisit.cheapestSeason}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-purple-500 font-medium">
                <PartyPopper className="w-5 h-5" />
                Major Festivals
              </div>
              <ul className="text-slate-700 text-sm list-disc list-inside">
                {bestTimeToVisit.majorFestivals.map((fest, i) => (
                  <li key={i} className="truncate" title={fest}>{fest}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
