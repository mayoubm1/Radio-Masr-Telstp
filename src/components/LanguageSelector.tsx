import React, { useState } from 'react';
import { Globe, ChevronDown, Languages, Loader2 } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇪🇬' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' }
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  showTranslation?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  showTranslation = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const currentLang = languages.find(lang => lang.code === selectedLanguage) || languages[1];

  const handleLanguageChange = async (langCode: string) => {
    if (langCode !== selectedLanguage) {
      setIsTranslating(true);
      // Simulate translation initialization
      await new Promise(resolve => setTimeout(resolve, 500));
      onLanguageChange(langCode);
      setIsTranslating(false);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/30 rounded-lg px-6 py-3 flex items-center gap-3 text-white transition-all shadow-lg shadow-cyan-500/20"
      >
        <Globe className="w-5 h-5" />
        <span className="text-xl">{currentLang.flag}</span>
        <div className="text-left">
          <span className="text-sm font-medium block">{currentLang.name}</span>
          <span className="text-xs text-cyan-200">{currentLang.nativeName}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-gray-900 border border-cyan-500/30 rounded-xl shadow-2xl z-50 min-w-[200px] overflow-hidden backdrop-blur-sm">
          <div className="p-2 border-b border-gray-700">
            <span className="text-xs text-gray-400 px-2">Select Language</span>
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-cyan-500/20 transition-colors ${
                lang.code === selectedLanguage ? 'bg-cyan-500/30 text-cyan-300' : 'text-white'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <div className="text-left flex-1">
                <span className="text-sm font-medium block">{lang.name}</span>
                <span className="text-xs text-gray-400">{lang.nativeName}</span>
              </div>
              {lang.code === selectedLanguage && (
                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {showTranslation && (
        <div className="mt-3 bg-black/40 rounded-xl p-4 border border-cyan-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            {isTranslating ? (
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            ) : (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            )}
            <Languages className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-medium">
              {isTranslating ? 'Initializing Translation...' : 'Live Translation Active'}
            </span>
          </div>
          <p className="text-white text-sm">
            {isTranslating 
              ? `Switching to ${languages.find(l => l.code === selectedLanguage)?.name}...`
              : `Real-time speech-to-text translation in ${currentLang.name}`
            }
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <span>Powered by Mistral AI</span>
            <span>•</span>
            <span>Low latency</span>
            <span>•</span>
            <span>High accuracy</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
