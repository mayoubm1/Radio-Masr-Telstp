import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ContentUpload from '@/components/admin/ContentUpload';
import AIAgentManager from '@/components/admin/AIAgentManager';
import ScheduleManager from '@/components/admin/ScheduleManager';
import BroadcastMonitor from '@/components/admin/BroadcastMonitor';
import { Radio, Upload, Users, Calendar, Activity, Home, Settings, Bell, User } from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const [notifications] = useState(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Top Navigation */}
      <header className="bg-black/30 border-b border-cyan-500/20 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Radio className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Radio TELsTP</h1>
                  <p className="text-xs text-cyan-400">Admin Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Site
              </Button>
              
              <div className="relative">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Bell className="w-5 h-5" />
                </Button>
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </div>
              
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Settings className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center gap-2 pl-4 border-l border-gray-700">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Status Bar */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-black/20 rounded-lg border border-cyan-500/20">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">Broadcasting Live</span>
          </div>
          <div className="h-4 w-px bg-gray-700" />
          <span className="text-gray-400 text-sm">Current Host: Dr. Amira Hassan</span>
          <div className="h-4 w-px bg-gray-700" />
          <span className="text-gray-400 text-sm">Listeners: 12,847</span>
          <div className="h-4 w-px bg-gray-700" />
          <span className="text-gray-400 text-sm">Stream Quality: Excellent</span>
          <div className="ml-auto">
            <span className="text-cyan-400 text-sm">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} UTC
            </span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="monitor" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 p-1 rounded-lg mb-6">
            <TabsTrigger 
              value="monitor" 
              className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Broadcast Monitor</span>
              <span className="sm:hidden">Monitor</span>
            </TabsTrigger>
            <TabsTrigger 
              value="content"
              className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Content Upload</span>
              <span className="sm:hidden">Content</span>
            </TabsTrigger>
            <TabsTrigger 
              value="agents"
              className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">AI Agents</span>
              <span className="sm:hidden">Agents</span>
            </TabsTrigger>
            <TabsTrigger 
              value="schedule"
              className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Schedule</span>
              <span className="sm:hidden">Schedule</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitor">
            <BroadcastMonitor />
          </TabsContent>
          <TabsContent value="content">
            <ContentUpload />
          </TabsContent>
          <TabsContent value="agents">
            <AIAgentManager />
          </TabsContent>
          <TabsContent value="schedule">
            <ScheduleManager />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Radio TELsTP Admin Dashboard • Tawasol Egypt Life Science Technology Park
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Powered by Mistral AI • Supabase • Netlify
          </p>
        </div>
      </footer>
    </div>
  );
}
