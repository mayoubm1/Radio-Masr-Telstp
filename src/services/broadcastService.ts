import { supabase } from '@/lib/supabase';

export interface BroadcastStatus {
  isLive: boolean;
  streamUrl: string;
  currentProgram: string;
  currentHost: string;
  startTime: Date;
  listeners: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  bitrate: number;
  language: string;
}

export interface ProgramScheduleItem {
  id: string;
  title: string;
  host: string;
  startTime: string;
  endTime: string;
  type: 'live' | 'recorded' | 'podcast';
  language: string;
  description: string;
  isActive: boolean;
}

export interface ListenerStats {
  total: number;
  byLanguage: Record<string, number>;
  byRegion: Record<string, number>;
  peakToday: number;
  averageSessionDuration: number;
}

// Simulated broadcast state
let broadcastState: BroadcastStatus = {
  isLive: true,
  streamUrl: 'https://stream.telstp.radio/live',
  currentProgram: 'Morning Science Brief',
  currentHost: 'Dr. Amira Hassan',
  startTime: new Date(),
  listeners: 12847,
  quality: 'excellent',
  bitrate: 320,
  language: 'en'
};

let listenerStats: ListenerStats = {
  total: 12847,
  byLanguage: {
    'en': 5234,
    'ar': 4521,
    'fr': 1823,
    'es': 789,
    'de': 480
  },
  byRegion: {
    'Egypt': 4521,
    'Middle East': 2134,
    'Europe': 3245,
    'Americas': 1823,
    'Asia': 1124
  },
  peakToday: 15632,
  averageSessionDuration: 23.5
};

// Simulate listener count changes
let listenerInterval: NodeJS.Timeout | null = null;

export function startListenerSimulation(callback: (count: number) => void) {
  if (listenerInterval) clearInterval(listenerInterval);
  
  listenerInterval = setInterval(() => {
    const change = Math.floor(Math.random() * 100) - 50;
    broadcastState.listeners = Math.max(10000, broadcastState.listeners + change);
    listenerStats.total = broadcastState.listeners;
    callback(broadcastState.listeners);
  }, 5000);
}

export function stopListenerSimulation() {
  if (listenerInterval) {
    clearInterval(listenerInterval);
    listenerInterval = null;
  }
}

export async function getBroadcastStatus(): Promise<BroadcastStatus> {
  try {
    const { data, error } = await supabase.functions.invoke('broadcast-status', {
      body: { action: 'get_status' }
    });

    if (error || !data) {
      return broadcastState;
    }

    return data.status || broadcastState;
  } catch {
    return broadcastState;
  }
}

export async function getListenerStats(): Promise<ListenerStats> {
  try {
    const { data, error } = await supabase.functions.invoke('broadcast-status', {
      body: { action: 'get_listeners' }
    });

    if (error || !data) {
      return listenerStats;
    }

    return data.stats || listenerStats;
  } catch {
    return listenerStats;
  }
}

export async function getCurrentSchedule(): Promise<ProgramScheduleItem[]> {
  const now = new Date();
  const currentHour = now.getHours();
  
  const schedule: ProgramScheduleItem[] = [
    {
      id: '1',
      title: 'Morning Science Brief',
      host: 'Dr. Amira Hassan',
      startTime: '06:00',
      endTime: '08:00',
      type: 'live',
      language: 'en',
      description: 'Latest developments in biotechnology and research',
      isActive: currentHour >= 6 && currentHour < 8
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
      isActive: currentHour >= 8 && currentHour < 10
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
      isActive: currentHour >= 10 && currentHour < 12
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
      isActive: currentHour >= 12 && currentHour < 14
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
      isActive: currentHour >= 14 && currentHour < 16
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
      isActive: currentHour >= 16 && currentHour < 18
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
      isActive: currentHour >= 18 && currentHour < 20
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
      isActive: currentHour >= 20 && currentHour < 22
    }
  ];

  return schedule;
}

export function updateBroadcastLanguage(language: string) {
  broadcastState.language = language;
}

export function getStreamQuality(): { quality: string; bitrate: number; latency: number } {
  const qualities = ['excellent', 'good', 'fair'];
  const randomQuality = qualities[Math.floor(Math.random() * 2)]; // Mostly excellent or good
  
  return {
    quality: randomQuality,
    bitrate: 320,
    latency: Math.floor(Math.random() * 50) + 10
  };
}

// HLS Stream simulation
export function getHLSStreamUrl(language: string): string {
  return `https://stream.telstp.radio/hls/${language}/playlist.m3u8`;
}

// WebRTC connection simulation
export async function initializeWebRTCConnection(): Promise<{ connected: boolean; peerId: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        connected: true,
        peerId: `peer-${Math.random().toString(36).substr(2, 9)}`
      });
    }, 1000);
  });
}
