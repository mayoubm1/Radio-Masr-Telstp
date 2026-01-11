import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Globe, Radio, Signal, Wifi, Settings, Languages, SkipForward, SkipBack, Maximize2, Minimize2 } from 'lucide-react';
import { agoraBroadcastService, BroadcastState } from '@/services/agoraBroadcastService';
import { translateContent } from '@/services/mistralService';

interface RadioPlayerProps {
  isLive: boolean;
  currentHost: string;
  currentProgram: string;
  listeners: number;
}

const RadioPlayer: React.FC<RadioPlayerProps> = ({
  isLive: initialIsLive,
  currentHost: initialHost,
  currentProgram: initialProgram,
  listeners: initialListeners
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [broadcastState, setBroadcastState] = useState<BroadcastState>({
    isConnected: false,
    isPlaying: false,
    currentChannel: 'radio-telstp-main',
    quality: 'excellent',
    bitrate: 128,
    latency: 50,
    listeners: initialListeners
  });
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [broadcastLanguage, setBroadcastLanguage] = useState('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(32).fill(0));

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇪🇬' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  // Subscribe to broadcast state changes
  useEffect(() => {
    const unsubscribe = agoraBroadcastService.subscribe(setBroadcastState);
    return () => unsubscribe();
  }, []);

  // Simulate audio visualizer
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setVisualizerData(prev => 
          prev.map(() => Math.random() * 100)
        );
      }, 100);
      return () => clearInterval(interval);
    } else {
      setVisualizerData(new Array(32).fill(0));
    }
  }, [isPlaying]);

  // Simulate transcript updates
  useEffect(() => {
    if (isPlaying && broadcastState.isConnected) {
      const transcripts = [
        "Welcome to Radio TELsTP, broadcasting live from Tawasol Egypt Life Science Technology Park.",
        "Today we're exploring the latest breakthroughs in biotechnology research.",
        "Our team of scientists has made remarkable progress in gene therapy applications.",
        "Stay tuned for more updates on innovation and discovery.",
        "This is your source for life science news, 24 hours a day, 7 days a week.",
        "We're now discussing the future of personalized medicine.",
        "Artificial intelligence is revolutionizing drug discovery processes.",
        "Join us as we explore the intersection of technology and healthcare."
      ];
      
      let index = 0;
      const transcriptInterval = setInterval(() => {
        setCurrentTranscript(transcripts[index % transcripts.length]);
        index++;
      }, 8000);

      return () => clearInterval(transcriptInterval);
    }
  }, [isPlaying, broadcastState.isConnected]);

  // Auto-translate when language changes
  useEffect(() => {
    if (currentTranscript && selectedLanguage !== broadcastLanguage) {
      handleTranslate();
    } else {
      setTranslatedText('');
    }
  }, [currentTranscript, selectedLanguage]);

  const handleTranslate = async () => {
    if (!currentTranscript || selectedLanguage === broadcastLanguage) return;
    
    setIsTranslating(true);
    try {
      const result = await translateContent(currentTranscript, broadcastLanguage, selectedLanguage);
      setTranslatedText(result.translation);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const togglePlay = async () => {
    if (isPlaying) {
      agoraBroadcastService.stopPlaying();
      setIsPlaying(false);
    } else {
      const success = await agoraBroadcastService.startPlaying();
      if (success) {
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    agoraBroadcastService.setVolume(isMuted ? volume : 0);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    agoraBroadcastService.setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleLanguageChange = async (langCode: string) => {
    setSelectedLanguage(langCode);
    setShowLanguageMenu(false);
    
    // Switch to language-specific channel
    if (isPlaying) {
      await agoraBroadcastService.switchChannel(langCode);
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      default: return 'text-red-400';
    }
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900 via-blue-900/50 to-gray-900 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 overflow-hidden transition-all ${isExpanded ? 'p-8' : 'p-6'}`}>
      {/* Audio Visualizer */}
      <div className="flex items-end justify-center gap-0.5 h-16 mb-6 px-4">
        {visualizerData.map((value, index) => (
          <div
            key={index}
            className="w-1.5 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-full transition-all duration-100"
            style={{ 
              height: `${Math.max(4, value * 0.6)}%`,
              opacity: isPlaying ? 0.8 : 0.2
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Radio className="w-8 h-8 text-white" />
            </div>
            {initialIsLive && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full animate-pulse border-2 border-gray-900 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-white font-bold text-xl">Radio TELsTP</h3>
            <p className="text-cyan-300 text-sm">Live from Cairo, Egypt</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <Wifi className={`w-4 h-4 ${broadcastState.isConnected ? 'text-green-400' : 'text-gray-500'}`} />
            <span className="text-xs text-gray-400 capitalize">
              {broadcastState.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {/* Listener Count */}
          <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 font-semibold">{broadcastState.listeners.toLocaleString()}</span>
            <span className="text-gray-400 text-sm hidden sm:inline">listeners</span>
          </div>

          {/* Expand/Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Now Playing */}
      <div className="bg-black/40 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-cyan-300 text-sm font-medium">Now Playing</span>
            {initialIsLive && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                LIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Signal className={`w-4 h-4 ${getQualityColor(broadcastState.quality)}`} />
            <span className={`text-xs ${getQualityColor(broadcastState.quality)}`}>
              {broadcastState.bitrate}kbps • {broadcastState.latency}ms
            </span>
          </div>
        </div>
        <h4 className="text-white font-bold text-lg mb-1">{initialProgram}</h4>
        <p className="text-gray-300 text-sm">Host: {initialHost}</p>
        
        {/* Live Transcript */}
        {isPlaying && currentTranscript && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">Live Transcript</span>
            </div>
            <p className="text-gray-300 text-sm italic leading-relaxed">"{currentTranscript}"</p>
            
            {/* Translation */}
            {selectedLanguage !== broadcastLanguage && (
              <div className="mt-3 pt-3 border-t border-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Languages className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-cyan-400">
                    {isTranslating ? 'Translating...' : `Translated to ${languages.find(l => l.code === selectedLanguage)?.name}`}
                  </span>
                </div>
                {translatedText && (
                  <p className="text-cyan-200 text-sm italic leading-relaxed">"{translatedText}"</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Play Controls */}
        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-white transition-colors p-2 hidden sm:block">
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={togglePlay}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full p-4 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30"
          >
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
          </button>
          <button className="text-gray-400 hover:text-white transition-colors p-2 hidden sm:block">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
        
        {/* Volume Control */}
        <div className="flex items-center gap-3 flex-1">
          <button onClick={toggleMute} className="text-cyan-400 hover:text-cyan-300 transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50"
          />
          <span className="text-cyan-300 text-sm w-10 hidden sm:block">{isMuted ? 0 : volume}%</span>
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-2 bg-black/30 hover:bg-black/50 px-3 py-2 rounded-lg transition-colors"
          >
            <Languages className="w-5 h-5 text-cyan-400" />
            <span className="text-white text-sm hidden sm:block">
              {languages.find(l => l.code === selectedLanguage)?.flag}
            </span>
          </button>
          
          {showLanguageMenu && (
            <div className="absolute bottom-full mb-2 right-0 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50 min-w-[160px]">
              <div className="p-2 border-b border-gray-700">
                <span className="text-xs text-gray-400">Select Language</span>
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition-colors ${
                    selectedLanguage === lang.code ? 'bg-cyan-500/20 text-cyan-400' : 'text-white'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="text-sm">{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-gray-400 hover:text-white transition-colors p-2"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h5 className="text-white font-semibold mb-4">Stream Settings</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 p-4 rounded-lg">
              <span className="text-xs text-gray-400 block mb-1">Quality</span>
              <p className={`font-semibold capitalize ${getQualityColor(broadcastState.quality)}`}>
                {broadcastState.quality}
              </p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <span className="text-xs text-gray-400 block mb-1">Bitrate</span>
              <p className="text-white font-semibold">{broadcastState.bitrate} kbps</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <span className="text-xs text-gray-400 block mb-1">Latency</span>
              <p className="text-white font-semibold">{broadcastState.latency} ms</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <span className="text-xs text-gray-400 block mb-1">Protocol</span>
              <p className="text-white font-semibold">Agora RTC</p>
            </div>
          </div>
          
          {/* Channel Selection */}
          <div className="mt-4">
            <span className="text-xs text-gray-400 block mb-2">Available Channels</span>
            <div className="flex flex-wrap gap-2">
              {agoraBroadcastService.getChannels().map((channel) => (
                <button
                  key={channel.name}
                  onClick={() => handleLanguageChange(channel.language)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedLanguage === channel.language
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {languages.find(l => l.code === channel.language)?.name} ({channel.listeners.toLocaleString()})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RadioPlayer;
