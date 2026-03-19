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
              className="absolute inset-0 bg-slate-900/20 flex items-center justify-center backdrop-blur
