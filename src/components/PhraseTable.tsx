import { Volume2 } from 'lucide-react';

interface PhraseTableProps {
  phrases: {
    english: string;
    local: string;
    phonetic: string;
  }[];
}

export function PhraseTable({ phrases }: PhraseTableProps) {
  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to guess language or just use default
      // We could pass language code from Gemini, but default usually works okay for basic phrases
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
            <th className="pb-3 font-medium">English Phrase</th>
            <th className="pb-3 font-medium">Local Language</th>
            <th className="pb-3 font-medium">Pronunciation</th>
            <th className="pb-3 font-medium text-right">Listen</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {phrases.map((phrase, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors">
              <td className="py-4 pr-4 font-medium text-slate-800">{phrase.english}</td>
              <td className="py-4 pr-4 text-blue-700 font-medium">{phrase.local}</td>
              <td className="py-4 pr-4 text-slate-500 italic">{phrase.phonetic}</td>
              <td className="py-4 text-right">
                <button
                  onClick={() => playAudio(phrase.local)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors inline-flex items-center justify-center"
                  title="Play pronunciation"
                >
                  <Volume2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
