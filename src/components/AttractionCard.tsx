import React, { useState, useEffect } from 'react';
import { generateAttractionImage, editAttractionImage } from '../services/gemini';
import { X, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AttractionCardProps {
  attraction: {
    name: string;
    city: string;
    famousFor: string;
    interestingFact: string;
    imageSearchQuery?: string;
  };
  countryName: string;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({ attraction, countryName }) => {
  const [imageSrc, setImageSrc] = useState(`https://picsum.photos/seed/${encodeURIComponent(attraction.name)}/50/30?blur=10`);
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [base64Data, setBase64Data] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      try {
        const prompt = `A high-quality, accurate, realistic photo of ${attraction.name} in ${attraction.city}, ${countryName}.`;
        const b64 = await generateAttractionImage(prompt);
        if (isMounted) {
          setBase64Data(b64);
          setImageSrc(b64);
          setIsHighResLoaded(true);
          setIsGenerating(false);
        }
      } catch (e) {
        console.error("Failed to generate image", e);
        if (isMounted) {
          // Fallback to a clear picsum image if generation fails
          setImageSrc(`https://picsum.photos/seed/${encodeURIComponent(attraction.name)}/400/300`);
          setIsHighResLoaded(true);
          setIsGenerating(false);
        }
      }
    };
    fetchImage();
    return () => { isMounted = false; };
  }, [attraction.name, attraction.city, countryName]);

  const handleEdit = async () => {
    if (!editPrompt.trim() || !base64Data) return;
    setIsGenerating(true);
    try {
      const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const data = matches[2];
        const newB64 = await editAttractionImage(data, mimeType, editPrompt);
        setBase64Data(newB64);
        setImageSrc(newB64);
      }
    } catch (e) {
      console.error("Failed to edit image", e);
    } finally {
      setIsGenerating(false);
      setIsEditing(false);
      setEditPrompt("");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative group">
      <div className="w-full sm:w-2/5 h-48 sm:h-auto shrink-0 relative overflow-hidden bg-slate-200">
        <img 
          src={imageSrc} 
          alt={attraction.name}
          className={`w-full h-full object-cover transition-all duration-700 ${!isHighResLoaded || isGenerating ? 'blur-md scale-105' : 'blur-none scale-100'}`}
          referrerPolicy="no-referrer"
        />
        
        <AnimatePresence>
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/20 flex items-center justify-center backdrop-blur-sm"
            >
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {isHighResLoaded && !isGenerating && base64Data && (
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
            title="Edit Image with AI"
          >
            <Sparkles size={16} />
          </button>
        )}

        <AnimatePresence>
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-0 bg-black/80 p-4 flex flex-col justify-center"
            >
              <button 
                onClick={() => setIsEditing(false)}
                className="absolute top-2 right-2 text-white/70 hover:text-white"
              >
                <X size={20} />
              </button>
              <label className="text-white text-xs font-medium mb-2 flex items-center gap-1">
                <Sparkles size={12} className="text-blue-400" />
                AI Image Edit
              </label>
              <input 
                type="text"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="e.g., Add a retro filter..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-blue-400 mb-3"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              />
              <button 
                onClick={handleEdit}
                disabled={!editPrompt.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Apply Edit
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="p-5 flex flex-col justify-center flex-1">
        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          {attraction.city}
        </div>
        <h3 className="font-bold text-xl text-slate-800 mb-2">{attraction.name}</h3>
        <p className="text-slate-600 text-sm mb-3">{attraction.famousFor}</p>
        <div className="mt-auto pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-500 italic">
            <span className="font-semibold text-slate-700 not-italic">Fact: </span>
            {attraction.interestingFact}
          </p>
        </div>
      </div>
    </div>
  );
}
