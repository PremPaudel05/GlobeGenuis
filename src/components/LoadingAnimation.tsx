import React from 'react';
import { motion } from 'motion/react';
import { Globe2 } from 'lucide-react';

export function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center w-full max-w-lg mx-auto">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "linear"
        }}
        className="mb-8 text-blue-500"
      >
        <Globe2 size={64} strokeWidth={1.5} />
      </motion.div>
      
      <h2 className="text-xl font-semibold text-slate-800 mb-8 animate-pulse">
        Gathering travel intelligence...
      </h2>
    </div>
  );
}
