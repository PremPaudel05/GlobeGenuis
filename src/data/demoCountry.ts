import { CountryData } from '../types';

export const demoCountryData: CountryData = {
  isValidCountry: true,
  overview: {
    flagEmoji: "🇳🇵",
    capital: "Kathmandu",
    population: "30 million",
    currency: "Nepalese Rupee",
    currencyCode: "NPR",
    exchangeRateToUSD: 130,
    timeZone: "UTC+5:45"
  },
  geography: {
    climate: "Subtropical in lowlands to arctic at highest elevations",
    landscape: "Mountainous terrain with Himalayas, hills, and Terai plains",
    majorCities: ["Kathmandu", "Pokhara", "Lalitpur", "Bharatpur"],
    naturalLandmarks: ["Mount Everest", "Annapurna Range", "Chitwan National Park"]
  },
  culture: {
    traditions: ["Dashain", "Tihar", "Holi", "Buddha Jayanti"],
    socialNorms: ["Namaste greeting", "Remove shoes before entering homes/temples"],
    religionOverview: "Hinduism (81%), Buddhism (9%), Islam (4%)",
    etiquetteTips: ["Always accept food with right hand", "Ask permission before taking photos"]
  },
  foods: [
    { name: "Dal Bhat", description: "Lentil soup with rice", famousFor: "Staple meal" },
    { name: "Momo", description: "Steamed dumplings", famousFor: "Street food" }
  ],
  attractions: [
    { name: "Pashupatinath Temple", city: "Kathmandu", famousFor: "Sacred Hindu temple", interestingFact: "One of the holiest temples of Shiva", imageSearchQuery: "Pashupatinath Temple Nepal" },
    { name: "Boudhanath Stupa", city: "Kathmandu", famousFor: "Massive Buddhist stupa", interestingFact: "One of the largest stupas in South Asia", imageSearchQuery: "Boudhanath Stupa" }
  ],
  phrases: [
    { english: "Hello", local: "Namaste", phonetic: "na-ma-stay" },
    { english: "Thank you", local: "Dhanyabad", phonetic: "dhan-ya-bad" }
  ],
  prices: {
    hotel: "$20-100 per night",
    meal: "$5-15",
    streetFood: "$1-3",
    coffee: "$2-4",
    transport: "$1-5 for local rides",
    taxi: "$10-30 for airport transfer"
  },
  bestTimeToVisit: {
    bestMonths: "October to November (autumn) and March to May (spring)",
    rainySeason: "June to September",
    cheapestSeason: "December to February (winter, except holidays)",
    majorFestivals: ["Dashain (Oct)", "Tihar (Nov)", "Holi (Mar)"]
  },
  funFacts: [
    "Nepal has the highest mountain on Earth (Mount Everest).",
    "The flag of Nepal is the only national flag that is not rectangular."
  ],
  mapData: {
    countryQuery: "Nepal",
    cities: [
      { name: "Kathmandu", query: "Kathmandu Nepal", highlights: ["Durbar Square", "Swayambhunath"] },
      { name: "Pokhara", query: "Pokhara Nepal", highlights: ["Phewa Lake", "Sarangkot"] }
    ],
    bestBeaches: ["Fewa Beach (Pokhara)"],
    bestFoodAreas: ["Thamel (Kathmandu)", "Lakeside (Pokhara)"],
    nightlifeZones: ["Thamel", "Jhamsikhel"],
    instagrammableSpots: ["Patan Durbar Square", "Bandipur"],
    areasToAvoid: ["None specifically, but be cautious in isolated areas at night"]
  }
};
