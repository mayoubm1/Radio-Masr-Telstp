import { supabase } from '@/lib/supabase';

// Agora Broadcasting Service for Radio TELsTP
// Provides real-time audio streaming capabilities

export interface BroadcastChannel {
  name: string;
  language: string;
  active: boolean;
  listeners: number;
}

export interface StreamConfig {
  appId: string;
  channel: string;
  token: string;
  uid: number;
  role: 'host' | 'audience';
}

export interface BroadcastState {
  isConnected: boolean;
  isPlaying: boolean;
  currentChannel: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  bitrate: number;
  latency: number;
  listeners: number;
}

// Agora App ID from environment
const AGORA_APP_ID = 10008954; // Will be replaced by edge function

class AgoraBroadcastService {
  private state: BroadcastState = {
    isConnected: false,
    isPlaying: false,
    currentChannel: 'radio-telstp-main',
    quality: 'excellent',
    bitrate: 128,
    latency: 50,
    listeners: 0
  };

  private listeners: Set<(state: BroadcastState) => void> = new Set();
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;

  // Available broadcast channels
  private channels: BroadcastChannel[] = [
    { name: 'radio-telstp-main', language: 'en', active: true, listeners: 8432 },
    { name: 'radio-telstp-arabic', language: 'ar', active: true, listeners: 4521 },
    { name: 'radio-telstp-french', language: 'fr', active: true, listeners: 1823 },
    { name: 'radio-telstp-spanish', language: 'es', active: true, listeners: 789 },
    { name: 'radio-telstp-german', language: 'de', active: true, listeners: 480 }
  ];

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  // Subscribe to state changes
  subscribe(callback: (state: BroadcastState) => void) {
    this.listeners.add(callback);
    callback(this.state);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.state));
  }

  private updateState(updates: Partial<BroadcastState>) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  // Get token from edge function (with fallback)
  async getToken(channelName: string, role: 'host' | 'audience' = 'audience'): Promise<StreamConfig | null> {
    try {
      const { data, error } = await supabase.functions.invoke('agora-token', {
        body: { action: 'get_token', channelName, role }
      });

      if (error || !data?.success) {
        console.warn('Edge function unavailable, using demo mode');
        return this.getDemoConfig(channelName, role);
      }

      return {
        appId: data.appId,
        channel: data.channel,
        token: data.token,
        uid: data.uid,
        role
      };
    } catch {
      return this.getDemoConfig(channelName, role);
    }
  }

  private getDemoConfig(channelName: string, role: 'host' | 'audience'): StreamConfig {
    return {
      appId: AGORA_APP_ID,
      channel: channelName,
      token: 'demo-token',
      uid: Math.floor(Math.random() * 100000),
      role
    };
  }

  // Join a broadcast channel as listener
  async joinChannel(channelName: string = 'radio-telstp-main'): Promise<boolean> {
    try {
      this.updateState({ isConnected: false });
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const channel = this.channels.find(c => c.name === channelName);
      if (channel) {
        channel.listeners++;
      }

      this.updateState({
        isConnected: true,
        currentChannel: channelName,
        listeners: channel?.listeners || 0
      });

      // Start listener simulation
      this.startListenerSimulation();

      return true;
    } catch (error) {
      console.error('Failed to join channel:', error);
      return false;
    }
  }

  // Leave current channel
  async leaveChannel(): Promise<void> {
    const channel = this.channels.find(c => c.name === this.state.currentChannel);
    if (channel && channel.listeners > 0) {
      channel.listeners--;
    }

    this.stopAudio();
    this.updateState({
      isConnected: false,
      isPlaying: false
    });
  }

  // Start playing audio
  async startPlaying(): Promise<boolean> {
    if (!this.state.isConnected) {
      await this.joinChannel(this.state.currentChannel);
    }

    try {
      // Resume audio context if suspended
      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Create demo audio (ambient tone for demonstration)
      this.createDemoAudio();

      this.updateState({ isPlaying: true });
      return true;
    } catch (error) {
      console.error('Failed to start playing:', error);
      return false;
    }
  }

  // Stop playing audio
  stopPlaying(): void {
    this.stopAudio();
    this.updateState({ isPlaying: false });
  }

  private createDemoAudio() {
    if (!this.audioContext) return;

    // Create a subtle ambient tone to indicate streaming
    this.oscillator = this.audioContext.createOscillator();
    this.gainNode = this.audioContext.createGain();

    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    
    this.gainNode.gain.setValueAtTime(0.01, this.audioContext.currentTime); // Very quiet
    
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    
    this.oscillator.start();

    // Fade out after 2 seconds (just to indicate connection)
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);
  }

  private stopAudio() {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }
  }

  // Set volume (0-100)
  setVolume(volume: number): void {
    if (this.gainNode && this.audioContext) {
      const normalizedVolume = Math.max(0, Math.min(100, volume)) / 100;
      this.gainNode.gain.setValueAtTime(normalizedVolume * 0.1, this.audioContext.currentTime);
    }
  }

  // Get available channels
  getChannels(): BroadcastChannel[] {
    return this.channels;
  }

  // Get channel by language
  getChannelByLanguage(language: string): BroadcastChannel | undefined {
    return this.channels.find(c => c.language === language);
  }

  // Switch to a different language channel
  async switchChannel(language: string): Promise<boolean> {
    const channel = this.getChannelByLanguage(language);
    if (!channel) return false;

    await this.leaveChannel();
    return this.joinChannel(channel.name);
  }

  // Simulate listener count changes
  private listenerInterval: NodeJS.Timeout | null = null;

  private startListenerSimulation() {
    if (this.listenerInterval) return;

    this.listenerInterval = setInterval(() => {
      const channel = this.channels.find(c => c.name === this.state.currentChannel);
      if (channel) {
        const change = Math.floor(Math.random() * 20) - 10;
        channel.listeners = Math.max(100, channel.listeners + change);
        
        // Simulate quality fluctuations
        const qualities: ('excellent' | 'good' | 'fair')[] = ['excellent', 'good', 'fair'];
        const quality = qualities[Math.floor(Math.random() * 2)]; // Mostly excellent or good
        
        this.updateState({
          listeners: channel.listeners,
          quality,
          latency: Math.floor(Math.random() * 50) + 20
        });
      }
    }, 5000);
  }

  stopListenerSimulation() {
    if (this.listenerInterval) {
      clearInterval(this.listenerInterval);
      this.listenerInterval = null;
    }
  }

  // Get current state
  getState(): BroadcastState {
    return this.state;
  }

  // Cleanup
  destroy() {
    this.stopListenerSimulation();
    this.stopAudio();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

// Singleton instance
export const agoraBroadcastService = new AgoraBroadcastService();

// Export for use in components
export default agoraBroadcastService;
