import React, { useState } from 'react';
import { ExternalLink, Calendar, MapPin, Share2, Bookmark, Play } from 'lucide-react';

interface NewsCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  location?: string;
  link?: string;
  hasVideo?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  excerpt,
  image,
  date,
  category,
  location,
  link,
  hasVideo = false
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      'Research': 'from-blue-500 to-cyan-500',
      'Partnership': 'from-purple-500 to-pink-500',
      'Technology': 'from-green-500 to-emerald-500',
      'Sustainability': 'from-yellow-500 to-orange-500',
      'Innovation': 'from-red-500 to-rose-500'
    };
    return colors[cat] || 'from-cyan-500 to-blue-500';
  };

  return (
    <div 
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all duration-500 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-48">
        <img 
          src={image} 
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-70'
        }`} />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`bg-gradient-to-r ${getCategoryColor(category)} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}>
            {category}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className={`absolute top-4 right-4 flex gap-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsBookmarked(!isBookmarked);
            }}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isBookmarked ? 'bg-cyan-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur-sm text-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        
        {/* Video Play Button */}
        {hasVideo && (
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button className="w-16 h-16 bg-cyan-500/90 hover:bg-cyan-400 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50 transition-all transform hover:scale-110">
              <Play className="w-8 h-8 text-white ml-1" />
            </button>
          </div>
        )}
        
        {/* Bottom Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-4 text-xs text-gray-300">
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
              <Calendar className="w-3 h-3" />
              {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            {location && (
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                <MapPin className="w-3 h-3" />
                {location}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className={`text-white font-bold text-lg mb-3 line-clamp-2 transition-colors duration-300 ${
          isHovered ? 'text-cyan-300' : ''
        }`}>
          {title}
        </h3>

        <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
          {excerpt}
        </p>

        <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-all group/btn">
          <span>Read Full Story</span>
          <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default NewsCard;
