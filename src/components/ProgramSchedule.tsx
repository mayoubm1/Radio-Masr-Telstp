import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Mic, Music, Newspaper, Podcast, Radio, ChevronLeft, ChevronRight } from 'lucide-react';

interface Program {
  id: string;
  time: string;
  endTime: string;
  title: string;
  host: string;
  type: 'live' | 'music' | 'news' | 'podcast';
  duration: string;
  language: string;
  description: string;
}

const scheduleData: Program[] = [
  { id: '1', time: '06:00', endTime: '08:00', title: 'Morning Science Brief', host: 'Dr. Amira Hassan', type: 'news', duration: '2h', language: 'Arabic', description: 'Latest biotechnology developments and research news' },
  { id: '2', time: '08:00', endTime: '10:00', title: 'Innovation Hour', host: 'Prof. Ahmed Khalil', type: 'live', duration: '2h', language: 'English', description: 'Exploring AI and digital innovation in life sciences' },
  { id: '3', time: '10:00', endTime: '12:00', title: 'Global Research Roundup', host: 'Dr. Sarah Mohamed', type: 'live', duration: '2h', language: 'French', description: 'International collaboration and research news' },
  { id: '4', time: '12:00', endTime: '14:00', title: 'Midday Medical Report', host: 'Dr. Omar Farouk', type: 'podcast', duration: '2h', language: 'English', description: 'Medical research updates and health innovations' },
  { id: '5', time: '14:00', endTime: '16:00', title: 'Tech Talk TELsTP', host: 'Prof. Ahmed Khalil', type: 'live', duration: '2h', language: 'Spanish', description: 'Deep dive into technology trends' },
  { id: '6', time: '16:00', endTime: '18:00', title: 'Evening Science Show', host: 'Dr. Amira Hassan', type: 'live', duration: '2h', language: 'German', description: 'Interactive science discussions' },
  { id: '7', time: '18:00', endTime: '20:00', title: 'Research Spotlight', host: 'Dr. Sarah Mohamed', type: 'news', duration: '2h', language: 'Arabic', description: 'Featuring breakthrough research from TELsTP labs' },
  { id: '8', time: '20:00', endTime: '22:00', title: 'Night Owl Science', host: 'Dr. Omar Farouk', type: 'podcast', duration: '2h', language: 'English', description: 'Relaxed discussions on science and society' },
  { id: '9', time: '22:00', endTime: '06:00', title: 'Late Night Ambient', host: 'Auto DJ', type: 'music', duration: '8h', language: 'Instrumental', description: 'Ambient and instrumental music for late night listening' }
];

const ProgramSchedule: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('today');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentProgram = () => {
    const currentHour = currentTime.getHours();
    return scheduleData.find(program => {
      const startHour = parseInt(program.time.split(':')[0]);
      const endHour = parseInt(program.endTime.split(':')[0]);
      
      if (endHour < startHour) {
        // Overnight program
        return currentHour >= startHour || currentHour < endHour;
      }
      return currentHour >= startHour && currentHour < endHour;
    });
  };

  const currentProgram = getCurrentProgram();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'live': return <Mic className="w-4 h-4" />;
      case 'music': return <Music className="w-4 h-4" />;
      case 'news': return <Newspaper className="w-4 h-4" />;
      case 'podcast': return <Podcast className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'live': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'music': return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      case 'news': return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'podcast': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      default: return 'text-cyan-400 bg-cyan-400/20 border-cyan-400/30';
    }
  };

  const getLanguageFlag = (language: string) => {
    const flags: Record<string, string> = {
      'Arabic': '🇪🇬',
      'English': '🇬🇧',
      'French': '🇫🇷',
      'Spanish': '🇪🇸',
      'German': '🇩🇪',
      'Instrumental': '🎵'
    };
    return flags[language] || '🌐';
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-2xl font-bold flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Clock className="w-6 h-6 text-cyan-400" />
          </div>
          Program Schedule
        </h2>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          <select 
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="bg-gray-800 border border-cyan-500/30 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
          >
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">This Week</option>
          </select>
          <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Current Program Highlight */}
      {currentProgram && (
        <div className="mb-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl p-4 border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 font-semibold">Now Playing</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-sm font-bold">LIVE</span>
            </div>
          </div>
          <h3 className="text-white text-xl font-bold">{currentProgram.title}</h3>
          <p className="text-gray-300 text-sm">Host: {currentProgram.host}</p>
          <p className="text-gray-400 text-sm mt-1">{currentProgram.description}</p>
        </div>
      )}

      {/* Schedule List */}
      <div className="space-y-3">
        {scheduleData.map((program) => {
          const isCurrentProgram = currentProgram?.id === program.id;
          const isExpanded = expandedProgram === program.id;
          
          return (
            <div 
              key={program.id}
              onClick={() => setExpandedProgram(isExpanded ? null : program.id)}
              className={`rounded-xl p-4 border transition-all duration-300 cursor-pointer ${
                isCurrentProgram 
                  ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10' 
                  : 'bg-black/40 border-gray-700/50 hover:border-cyan-500/30 hover:bg-black/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Time */}
                  <div className="text-center min-w-[60px]">
                    <div className={`font-mono text-lg font-bold ${isCurrentProgram ? 'text-cyan-400' : 'text-cyan-500'}`}>
                      {program.time}
                    </div>
                    <div className="text-gray-500 text-xs">to {program.endTime}</div>
                  </div>
                  
                  {/* Divider */}
                  <div className={`w-px h-12 ${isCurrentProgram ? 'bg-cyan-500' : 'bg-gray-700'}`} />
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${isCurrentProgram ? 'text-white' : 'text-gray-200'}`}>
                        {program.title}
                      </h3>
                      {isCurrentProgram && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">Host: {program.host}</p>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 border ${getTypeColor(program.type)}`}>
                    {getTypeIcon(program.type)}
                    {program.type.toUpperCase()}
                  </span>
                  <span className="text-gray-400 text-xs bg-gray-700/50 px-2 py-1 rounded">
                    {program.duration}
                  </span>
                  <span className="text-cyan-300 text-sm bg-cyan-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                    <span>{getLanguageFlag(program.language)}</span>
                    {program.language}
                  </span>
                </div>
              </div>
              
              {/* Expanded Content */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-gray-300 text-sm">{program.description}</p>
                  <div className="flex gap-2 mt-3">
                    <button className="bg-cyan-500 hover:bg-cyan-400 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                      Set Reminder
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-4 border border-cyan-500/20">
        <div className="flex items-center justify-between">
          <p className="text-cyan-300 text-sm">
            All programs available with real-time translation in 5 languages
          </p>
          <div className="flex items-center gap-2">
            {['🇪🇬', '🇬🇧', '🇫🇷', '🇪🇸', '🇩🇪'].map((flag, i) => (
              <span key={i} className="text-lg">{flag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramSchedule;
