import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { CountryProfile } from './components/CountryProfile';
import { LoadingAnimation } from './components/LoadingAnimation';
import { CountryData } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const SEARCH_TIMEOUT_MS = 15000; // Increased to 15s to give Gemini time to think

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async (country: string) => {
    const trimmedCountry = country.trim();

    if (!trimmedCountry) {
      setError('Please enter a country name.');
      setCountryData(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setCountryData(null);

    try {
      // Setup a modern timeout controller for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);

      // Fetch from your new Vercel serverless function
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destination: trimmedCountry }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();
      
      // If Gemini returns the JSON as a string, we parse it. Otherwise, use it directly.
      const data = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;

      // Validate the returned data
      if (!data || data.isValidCountry === false) {
        setError('Destination not found. Please enter a valid country.');
      } else {
        setCountryData(data);
        setTimeout(() => {
          window.scrollTo({ top: window.innerHeight * 0.6, behavior: 'smooth' });
        }, 100);
      }
    } catch (err: any) {
      console.error("Search error:", err);

      const message = err instanceof Error ? err.message : 'Unknown error occurred';

      if (err.name === 'AbortError' || message.toLowerCase().includes('timed out')) {
        setError('The request took too long. Please try again in a moment.');
      } else {
        setError('We could not load travel insights right now. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Hero onSearch={handleSearch} isLoading={isLoading} />

      <main className="relative min-h-[50vh]">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-slate-50/80 backdrop-blur-sm flex items-start justify-center pt-20"
            >
              <LoadingAnimation />
            </motion.div>
          )}

          {error && !isLoading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto mt-20 p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center shadow-sm"
            >
              <div className="text-4xl mb-4">🌍</div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Travel insights are temporarily unavailable
              </h2>
              <p className="text-slate-600 leading-7">{error}</p>
            </motion.div>
          )}

          {countryData && !isLoading && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CountryProfile data={countryData} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center border-t border-slate-800 mt-auto">
        <p className="text-sm font-medium tracking-wide">Powered by GlobeGenius AI</p>
      </footer>
    </div>
  );
}
