import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Plus, Edit, Trash2, Play, Pause, Copy, ChevronLeft, ChevronRight, Radio, Users } from 'lucide-react';

interface ScheduleItem {
  id: string;
  title: string;
  host: string;
  startTime: string;
  endTime: string;
  type: 'live' | 'recorded' | 'podcast' | 'music';
  language: string;
  description: string;
  isActive: boolean;
  recurring: 'daily' | 'weekly' | 'once';
  days?: string[];
}

export default function ScheduleManager() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    {
      id: '1',
      title: 'Morning Science Brief',
      host: 'Dr. Amira Hassan',
      startTime: '06:00',
      endTime: '08:00',
      type: 'live',
      language: 'en',
      description: 'Latest developments in biotechnology and research',
      isActive: true,
      recurring: 'daily'
    },
    {
      id: '2',
      title: 'Innovation Hour',
      host: 'Prof. Ahmed Khalil',
      startTime: '08:00',
      endTime: '10:00',
      type: 'live',
      language: 'ar',
      description: 'Exploring AI and digital innovation in life sciences',
      isActive: false,
      recurring: 'daily'
    },
    {
      id: '3',
      title: 'Global Research Roundup',
      host: 'Dr. Sarah Mohamed',
      startTime: '10:00',
      endTime: '12:00',
      type: 'live',
      language: 'fr',
      description: 'International collaboration and research news',
      isActive: false,
      recurring: 'daily'
    },
    {
      id: '4',
      title: 'Midday Medical Report',
      host: 'Dr. Omar Farouk',
      startTime: '12:00',
      endTime: '14:00',
      type: 'recorded',
      language: 'en',
      description: 'Medical research updates and health innovations',
      isActive: false,
      recurring: 'daily'
    },
    {
      id: '5',
      title: 'Tech Talk TELsTP',
      host: 'Prof. Ahmed Khalil',
      startTime: '14:00',
      endTime: '16:00',
      type: 'podcast',
      language: 'es',
      description: 'Deep dive into technology trends',
      isActive: false,
      recurring: 'weekly',
      days: ['Monday', 'Wednesday', 'Friday']
    },
    {
      id: '6',
      title: 'Evening Science Show',
      host: 'Dr. Amira Hassan',
      startTime: '16:00',
      endTime: '18:00',
      type: 'live',
      language: 'de',
      description: 'Interactive science discussions',
      isActive: false,
      recurring: 'daily'
    },
    {
      id: '7',
      title: 'Research Spotlight',
      host: 'Dr. Sarah Mohamed',
      startTime: '18:00',
      endTime: '20:00',
      type: 'live',
      language: 'ar',
      description: 'Featuring breakthrough research from TELsTP labs',
      isActive: false,
      recurring: 'daily'
    },
    {
      id: '8',
      title: 'Night Owl Science',
      host: 'Dr. Omar Farouk',
      startTime: '20:00',
      endTime: '22:00',
      type: 'recorded',
      language: 'en',
      description: 'Relaxed discussions on science and society',
      isActive: false,
      recurring: 'daily'
    },
    {
      id: '9',
      title: 'Late Night Music',
      host: 'Auto DJ',
      startTime: '22:00',
      endTime: '06:00',
      type: 'music',
      language: 'en',
      description: 'Ambient and instrumental music',
      isActive: false,
      recurring: 'daily'
    }
  ]);

  const hosts = [
    'Dr. Amira Hassan',
    'Prof. Ahmed Khalil',
    'Dr. Sarah Mohamed',
    'Dr. Omar Farouk',
    'Auto DJ'
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' }
  ];

  const programTypes = [
    { value: 'live', label: 'Live Broadcast', color: 'bg-green-500' },
    { value: 'recorded', label: 'Pre-recorded', color: 'bg-blue-500' },
    { value: 'podcast', label: 'Podcast', color: 'bg-purple-500' },
    { value: 'music', label: 'Music/Auto', color: 'bg-yellow-500' }
  ];

  const getTypeColor = (type: string) => {
    return programTypes.find(t => t.value === type)?.color || 'bg-gray-500';
  };

  const navigateDate = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const duplicateItem = (item: ScheduleItem) => {
    const newItem: ScheduleItem = {
      ...item,
      id: Date.now().toString(),
      title: `${item.title} (Copy)`
    };
    setSchedule(prev => [...prev, newItem]);
  };

  const deleteItem = (id: string) => {
    setSchedule(prev => prev.filter(item => item.id !== id));
  };

  const toggleActive = (id: string) => {
    setSchedule(prev => prev.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ));
  };

  // Calculate timeline positions
  const getTimePosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return ((hours * 60 + minutes) / (24 * 60)) * 100;
  };

  const getItemWidth = (start: string, end: string) => {
    const startPos = getTimePosition(start);
    let endPos = getTimePosition(end);
    if (endPos < startPos) endPos += 100; // Handle overnight programs
    return endPos - startPos;
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigateDate(-1)} className="border-gray-600">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
            <p className="text-gray-400 text-sm">
              {selectedDate.toLocaleDateString('en-US', { year: 'numeric' })}
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={() => navigateDate(1)} className="border-gray-600">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setSelectedDate(new Date())}
            variant="outline" 
            className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
          >
            Today
          </Button>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-cyan-500 hover:bg-cyan-400"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Program
          </Button>
        </div>
      </div>

      {/* 24-Hour Timeline */}
      <Card className="p-6 bg-slate-800/50 border-cyan-500/20">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          24-Hour Timeline
        </h3>
        
        {/* Time markers */}
        <div className="relative h-8 mb-2">
          {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => (
            <div 
              key={hour}
              className="absolute text-xs text-gray-500"
              style={{ left: `${(hour / 24) * 100}%` }}
            >
              {hour.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>
        
        {/* Timeline bar */}
        <div className="relative h-16 bg-black/30 rounded-lg overflow-hidden">
          {/* Hour grid lines */}
          {Array.from({ length: 24 }).map((_, i) => (
            <div 
              key={i}
              className="absolute top-0 bottom-0 border-l border-gray-700/50"
              style={{ left: `${(i / 24) * 100}%` }}
            />
          ))}
          
          {/* Current time indicator */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
            style={{ 
              left: `${((new Date().getHours() * 60 + new Date().getMinutes()) / (24 * 60)) * 100}%` 
            }}
          >
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full" />
          </div>
          
          {/* Schedule items */}
          {schedule.map((item) => (
            <div
              key={item.id}
              className={`absolute top-1 bottom-1 rounded ${getTypeColor(item.type)} opacity-80 hover:opacity-100 cursor-pointer transition-opacity flex items-center px-2 overflow-hidden`}
              style={{
                left: `${getTimePosition(item.startTime)}%`,
                width: `${getItemWidth(item.startTime, item.endTime)}%`
              }}
              title={`${item.title} - ${item.host}`}
            >
              <span className="text-xs text-white font-medium truncate">
                {item.title}
              </span>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 mt-4">
          {programTypes.map((type) => (
            <div key={type.value} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${type.color}`} />
              <span className="text-xs text-gray-400">{type.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Schedule List */}
      <Card className="p-6 bg-slate-800/50 border-cyan-500/20">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          Program Schedule
        </h3>
        
        <div className="space-y-3">
          {schedule.map((item) => (
            <div 
              key={item.id}
              className={`p-4 rounded-lg border transition-all ${
                item.isActive 
                  ? 'bg-cyan-500/10 border-cyan-500' 
                  : 'bg-black/20 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[80px]">
                    <p className="text-cyan-400 font-mono text-sm">{item.startTime}</p>
                    <p className="text-gray-500 text-xs">to</p>
                    <p className="text-cyan-400 font-mono text-sm">{item.endTime}</p>
                  </div>
                  
                  <div className="border-l border-gray-700 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold">{item.title}</h4>
                      {item.isActive && (
                        <Badge className="bg-red-500 text-xs animate-pulse">LIVE NOW</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {item.host}
                      </span>
                      <Badge className={getTypeColor(item.type)} variant="secondary">
                        {item.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {languages.find(l => l.code === item.language)?.name}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {item.recurring}
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleActive(item.id)}
                    className={item.isActive ? 'text-red-400' : 'text-green-400'}
                  >
                    {item.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingItem(item)}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => duplicateItem(item)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteItem(item.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Weekly Overview */}
      <Card className="p-6 bg-slate-800/50 border-cyan-500/20">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Radio className="w-5 h-5 text-cyan-400" />
          Weekly Overview
        </h3>
        
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
            <div key={day} className="text-center">
              <p className="text-gray-400 text-sm mb-2">{day}</p>
              <div className="bg-black/30 rounded-lg p-2 min-h-[100px]">
                {schedule.filter(item => 
                  item.recurring === 'daily' || 
                  (item.recurring === 'weekly' && item.days?.includes(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][idx]))
                ).slice(0, 3).map((item) => (
                  <div 
                    key={item.id}
                    className={`text-xs p-1 mb-1 rounded ${getTypeColor(item.type)} text-white truncate`}
                    title={item.title}
                  >
                    {item.startTime}
                  </div>
                ))}
                {schedule.filter(item => 
                  item.recurring === 'daily' || 
                  (item.recurring === 'weekly' && item.days?.includes(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][idx]))
                ).length > 3 && (
                  <p className="text-xs text-gray-500">+{schedule.length - 3} more</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
