import { useState } from 'react';
import { CountryData } from '../types';
import { ExpandableCard } from './ExpandableCard';
import { MapSection } from './MapSection';
import { PhraseTable } from './PhraseTable';
import { AttractionCard } from './AttractionCard';
import { 
  Globe, 
  Map, 
  Users, 
  Utensils, 
  Camera, 
  MessageCircle, 
  CreditCard, 
  Lightbulb,
  ArrowRightLeft
} from 'lucide-react';

interface CountryProfileProps {
  data: CountryData;
}

export function CountryProfile({ data }: CountryProfileProps) {
  const [usdAmount, setUsdAmount] = useState<number | string>(100);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">{data.overview.flagEmoji}</div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          {data.mapData.countryQuery}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Discover the culture, landscapes, and essential travel information for your next adventure.
        </p>
      </div>

      {/* 1. Overview */}
      <ExpandableCard title="Country Overview" icon={<Globe />} defaultExpanded>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-slate-50 p-4 rounded-xl">
            <div className="text-sm text-slate-500 mb-1">Capital</div>
            <div className="font-semibold text-slate-800">{data.overview.capital}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl">
            <div className="text-sm text-slate-500 mb-1">Population</div>
            <div className="font-semibold text-slate-800">{data.overview.population}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl">
            <div className="text-sm text-slate-500 mb-1">Currency</div>
            <div className="font-semibold text-slate-800">{data.overview.currency}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl">
            <div className="text-sm text-slate-500 mb-1">Time Zone</div>
            <div className="font-semibold text-slate-800">{data.overview.timeZone}</div>
          </div>
        </div>

        {/* Currency Converter */}
        {data.overview.exchangeRateToUSD && data.overview.currencyCode && (
          <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 text-sm mb-1 flex items-center gap-2">
                <ArrowRightLeft size={16} className="text-blue-600" />
                Quick Currency Converter
              </h4>
              <p className="text-xs text-blue-700/70">
                Approximate rate: 1 USD = {data.overview.exchangeRateToUSD} {data.overview.currencyCode}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                <input 
                  type="number" 
                  value={usdAmount}
                  onChange={(e) => setUsdAmount(e.target.value)}
                  className="w-24 pl-7 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 font-medium bg-white"
                  min="0"
                />
              </div>
              <span className="text-slate-400 font-medium">=</span>
              <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 font-semibold text-slate-800 min-w-[120px] text-center">
                {Number(usdAmount) ? (Number(usdAmount) * data.overview.exchangeRateToUSD).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'} {data.overview.currencyCode}
              </div>
            </div>
          </div>
        )}
      </ExpandableCard>

      {/* 2. Geography */}
      <ExpandableCard title="Geography & Climate" icon={<Map />}>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Climate</h3>
            <p className="text-slate-600 mb-6">{data.geography.climate}</p>
            
            <h3 className="font-semibold text-slate-800 mb-2">Landscape</h3>
            <p className="text-slate-600">{data.geography.landscape}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Major Cities</h3>
              <ul className="space-y-2">
                {data.geography.majorCities.map((city, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {city}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Natural Landmarks</h3>
              <ul className="space-y-2">
                {data.geography.naturalLandmarks.map((landmark, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {landmark}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </ExpandableCard>

      {/* 3. Culture & Etiquette */}
      <ExpandableCard title="Culture & Etiquette" icon={<Users />}>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Traditions & Social Norms</h3>
            <ul className="space-y-3 mb-6">
              {[...data.culture.traditions, ...data.culture.socialNorms].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <h3 className="font-semibold text-slate-800 mb-2">Religion</h3>
            <p className="text-slate-600">{data.culture.religionOverview}</p>
          </div>
          <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Lightbulb className="text-blue-600" size={20} />
              Etiquette Tips for Tourists
            </h3>
            <ul className="space-y-3">
              {data.culture.etiquetteTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ExpandableCard>

      {/* 4. Popular Foods */}
      <ExpandableCard title="Popular Foods" icon={<Utensils />}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.foods.map((food, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <h3 className="font-bold text-lg text-slate-800 mb-2">{food.name}</h3>
              <p className="text-slate-600 text-sm mb-3">{food.description}</p>
              <div className="text-xs font-medium text-blue-700 bg-blue-50 inline-block px-2 py-1 rounded-md">
                Why it's famous: {food.famousFor}
              </div>
            </div>
          ))}
        </div>
      </ExpandableCard>

      {/* 5. Top Tourist Attractions */}
      <ExpandableCard title="Top Tourist Attractions" icon={<Camera />}>
        <div className="grid md:grid-cols-2 gap-6">
          {data.attractions.map((attraction, i) => (
            <AttractionCard key={i} attraction={attraction} countryName={data.mapData.countryQuery} />
          ))}
        </div>
      </ExpandableCard>

      {/* Map Integration */}
      <MapSection mapData={data.mapData} bestTimeToVisit={data.bestTimeToVisit} />

      {/* 6. Essential Travel Phrases */}
      <ExpandableCard title="Essential Travel Phrases" icon={<MessageCircle />}>
        <PhraseTable phrases={data.phrases} />
      </ExpandableCard>

      {/* 7. Average Travel Prices */}
      <ExpandableCard title="Average Travel Prices (USD)" icon={<CreditCard />}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <PriceItem label="Mid-range Hotel" price={data.prices.hotel} icon="🏨" />
          <PriceItem label="Restaurant Meal" price={data.prices.meal} icon="🍽️" />
          <PriceItem label="Street Food" price={data.prices.streetFood} icon="🌮" />
          <PriceItem label="Coffee" price={data.prices.coffee} icon="☕" />
          <PriceItem label="Public Transport" price={data.prices.transport} icon="🚌" />
          <PriceItem label="Taxi (per km)" price={data.prices.taxi} icon="🚕" />
        </div>
      </ExpandableCard>
    </div>
  );
}

function PriceItem({ label, price, icon }: { label: string, price: string, icon: string }) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</div>
        <div className="font-bold text-slate-800 text-lg">{price}</div>
      </div>
    </div>
  );
}
