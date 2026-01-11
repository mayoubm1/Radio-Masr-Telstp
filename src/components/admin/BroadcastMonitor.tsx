import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Radio, Users, Clock, AlertCircle, Globe, Signal, Wifi, Play, Pause, RefreshCw, TrendingUp, BarChart3 } from 'lucide-react';
import { getBroadcastStatus, getListenerStats, getCurrentSchedule, startListenerSimulation, stopListenerSimulation, getStreamQuality, ProgramScheduleItem, ListenerStats } from '@/services/broadcastService';

export default function BroadcastMonitor() {
  const [listeners, setListeners] = useState(12847);
  const [listenerStats, setListenerStats] = useState<ListenerStats | null>(null);
  const [schedule, setSchedule] = useState<ProgramScheduleItem[]>([]);
  const [streamQuality, setStreamQuality] = useState({ quality: 'excellent', bitrate: 320, latency: 15 });
  const [isStreaming, setIsStreaming] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    loadData();
    startListenerSimulation(setListeners);
    
    const qualityInterval = setInterval(() => {
      setStreamQuality(getStreamQuality());
    }, 5000);

    return () => {
      stopListenerSimulation();
      clearInterval(qualityInterval);
    };
  }, []);

  const loadData = async () => {
    const stats = await getListenerStats();
    const scheduleData = await getCurrentSchedule();
    setListenerStats(stats);
    setSchedule(scheduleData);
    setLastRefresh(new Date());
  };

  const currentProgram = schedule.find(p => p.isActive);

  const stats = [
    { label: 'Live Listeners', value: listeners.toLocaleString(), icon: Users, color: 'text-green-400', bgColor: 'bg-green-500/10' },
    { label: 'Current Program', value: currentProgram?.title || 'Innovation Hour', icon: Radio, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
    { label: 'Stream Quality', value: streamQuality.quality.charAt(0).toUpperCase() + streamQuality.quality.slice(1), icon: Signal, color: streamQuality.quality === 'excellent' ? 'text-green-400' : 'text-yellow-400', bgColor: 'bg-blue-500/10' },
    { label: 'Peak Today', value: listenerStats?.peakToday?.toLocaleString() || '15,632', icon: TrendingUp, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  ];

  const recentActivity = [
    { time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), event: `Program started: ${currentProgram?.title || 'Innovation Hour'}`, host: currentProgram?.host || 'Prof. Ahmed Khalil', status: 'success' },
    { time: '14:15', event: 'Content uploaded: Research Update Q4', user: 'Admin', status: 'info' },
    { time: '13:58', event: 'AI Host task completed: Morning Brief', task: 'Script Generation', status: 'success' },
    { time: '13:45', event: 'Translation service: Arabic to English', user: 'System', status: 'info' },
    { time: '13:30', event: 'New listener milestone: 15,000 concurrent', user: 'System', status: 'success' },
  ];

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`${isStreaming ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isStreaming ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isStreaming ? 'Pause Stream' : 'Start Stream'}
          </Button>
          <Button variant="outline" onClick={loadData} className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="text-sm text-gray-400">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className={`p-6 ${stat.bgColor} border-cyan-500/20 backdrop-blur-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Listener Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-slate-800/50 border-cyan-500/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            Listeners by Language
          </h2>
          <div className="space-y-3">
            {listenerStats && Object.entries(listenerStats.byLanguage).map(([lang, count]) => {
              const percentage = (count / listenerStats.total) * 100;
              const langNames: Record<string, string> = { en: 'English', ar: 'Arabic', fr: 'French', es: 'Spanish', de: 'German' };
              return (
                <div key={lang} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{langNames[lang] || lang}</span>
                    <span className="text-cyan-400">{count.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 bg-slate-800/50 border-cyan-500/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Listeners by Region
          </h2>
          <div className="space-y-3">
            {listenerStats && Object.entries(listenerStats.byRegion).map(([region, count]) => {
              const percentage = (count / listenerStats.total) * 100;
              return (
                <div key={region} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{region}</span>
                    <span className="text-purple-400">{count.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Stream Quality & Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-slate-800/50 border-cyan-500/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Wifi className="w-5 h-5 text-cyan-400" />
            Stream Quality
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-black/30 p-4 rounded-lg text-center">
              <p className="text-xs text-gray-400 mb-1">Quality</p>
              <Badge className={getQualityColor(streamQuality.quality)}>
                {streamQuality.quality}
              </Badge>
            </div>
            <div className="bg-black/30 p-4 rounded-lg text-center">
              <p className="text-xs text-gray-400 mb-1">Bitrate</p>
              <p className="text-white font-bold">{streamQuality.bitrate} kbps</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg text-center">
              <p className="text-xs text-gray-400 mb-1">Latency</p>
              <p className="text-white font-bold">{streamQuality.latency} ms</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
              <span className="text-gray-300">Streaming Server</span>
              <Badge className="bg-green-500">Online</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
              <span className="text-gray-300">CDN Status</span>
              <Badge className="bg-green-500">Active</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
              <span className="text-gray-300">Backup Stream</span>
              <Badge className="bg-blue-500">Standby</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-slate-800/50 border-cyan-500/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Recent Activity
          </h2>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="p-3 bg-black/20 rounded-lg border border-cyan-500/10 flex items-start gap-3">
                <div className="text-cyan-400 font-mono text-xs whitespace-nowrap">{activity.time}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{activity.event}</p>
                  {activity.host && <p className="text-xs text-gray-400">Host: {activity.host}</p>}
                  {activity.user && <p className="text-xs text-gray-400">By: {activity.user}</p>}
                  {activity.task && <p className="text-xs text-gray-400">Task: {activity.task}</p>}
                </div>
                <Badge 
                  variant={activity.status === 'success' ? 'default' : 'outline'}
                  className={activity.status === 'success' ? 'bg-green-500' : ''}
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Current Schedule */}
      <Card className="p-6 bg-slate-800/50 border-cyan-500/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Today's Schedule
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {schedule.slice(0, 8).map((program) => (
            <div 
              key={program.id}
              className={`p-4 rounded-lg border ${
                program.isActive 
                  ? 'bg-cyan-500/20 border-cyan-500' 
                  : 'bg-black/20 border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">{program.startTime} - {program.endTime}</span>
                {program.isActive && (
                  <Badge className="bg-red-500 text-xs">LIVE</Badge>
                )}
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">{program.title}</h4>
              <p className="text-gray-400 text-xs">{program.host}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {program.language.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {program.type}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* System Status */}
      <Card className="p-6 bg-slate-800/50 border-cyan-500/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          System Status
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex justify-between items-center p-4 bg-black/20 rounded-lg">
            <span className="text-gray-300">Streaming Server</span>
            <Badge className="bg-green-500">Online</Badge>
          </div>
          <div className="flex justify-between items-center p-4 bg-black/20 rounded-lg">
            <span className="text-gray-300">AI Agent System</span>
            <Badge className="bg-green-500">Active</Badge>
          </div>
          <div className="flex justify-between items-center p-4 bg-black/20 rounded-lg">
            <span className="text-gray-300">Content Storage</span>
            <Badge className="bg-green-500">Connected</Badge>
          </div>
          <div className="flex justify-between items-center p-4 bg-black/20 rounded-lg">
            <span className="text-gray-300">Translation Service</span>
            <Badge className="bg-green-500">Running</Badge>
          </div>
          <div className="flex justify-between items-center p-4 bg-black/20 rounded-lg">
            <span className="text-gray-300">Mistral AI API</span>
            <Badge className="bg-green-500">Connected</Badge>
          </div>
          <div className="flex justify-between items-center p-4 bg-black/20 rounded-lg">
            <span className="text-gray-300">Database</span>
            <Badge className="bg-green-500">Healthy</Badge>
          </div>
          <div className="flex justify-between items-center p-4 bg-black/20 rounded-lg">
            <span className="text-gray-300">CDN</span>
            <Badge className="bg-green-500">Optimal</Badge>
          </div>
          <div className="flex justify-between items-center p-4 bg-black/20 rounded-lg">
            <span className="text-gray-300">WebRTC Gateway</span>
            <Badge className="bg-green-500">Ready</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
