import React, { useState } from 'react';
import { Mic, Clock, Languages, Play, MessageSquare, Star } from 'lucide-react';

interface AIHostCardProps {
  name: string;
  avatar: string;
  role: string;
  languages: string[];
  isActive: boolean;
  nextShow: string;
  specialty: string;
}

const AIHostCard: React.FC<AIHostCardProps> = ({
  name,
  avatar,
  role,
  languages,
  isActive,
  nextShow,
  specialty
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border transition-all duration-500 transform ${
        isActive 
          ? 'border-cyan-400 shadow-2xl shadow-cyan-400/30 scale-105' 
          : 'border-gray-700 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar Section */}
      <div className="relative mb-6">
        <div className={`relative w-24 h-24 mx-auto rounded-full overflow-hidden border-4 transition-all duration-300 ${
          isActive ? 'border-cyan-400' : 'border-gray-600'
        }`}>
          <img 
            src={avatar} 
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          {/* Glow effect for active host */}
          {isActive && (
            <div className="absolute inset-0 bg-cyan-400/20 animate-pulse" />
          )}
        </div>
        
        {/* Live Badge */}
        {isActive && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-green-500/30">
              <Mic className="w-3 h-3 animate-pulse" />
              <span className="font-bold">LIVE</span>
            </div>
          </div>
        )}

        {/* Rating */}
        <div className="absolute -top-1 -right-1 bg-yellow-500/20 rounded-full p-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </div>
      </div>

      {/* Info Section */}
      <div className="text-center mb-4">
        <h3 className="text-white font-bold text-lg mb-1">{name}</h3>
        <p className="text-cyan-400 text-sm font-medium">{role}</p>
        <p className="text-gray-500 text-xs mt-1">{specialty}</p>
      </div>

      {/* Languages */}
      <div className="mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Languages className="w-4 h-4 text-cyan-400" />
          <span className="text-gray-400 text-xs">Languages</span>
        </div>
        <div className="flex flex-wrap justify-center gap-1">
          {languages.map((lang, index) => (
            <span 
              key={index}
              className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-xs px-2 py-1 rounded-full border border-cyan-500/30"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-gray-400" />
        <span className={`text-sm ${isActive ? 'text-green-400 font-semibold' : 'text-gray-400'}`}>
          {nextShow}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {isActive ? (
          <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-sm py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/30">
            <Play className="w-4 h-4" />
            Listen Now
          </button>
        ) : (
          <>
            <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors">
              <Play className="w-3 h-3" />
              Preview
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 px-3 rounded-lg flex items-center justify-center transition-colors">
              <MessageSquare className="w-3 h-3" />
            </button>
          </>
        )}
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div className="mt-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-3 border border-cyan-500/20">
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-6 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              <div className="w-1 h-5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
              <div className="w-1 h-4 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '600ms' }} />
            </div>
            <span className="text-cyan-300 text-sm font-medium ml-2">Broadcasting</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIHostCard;
