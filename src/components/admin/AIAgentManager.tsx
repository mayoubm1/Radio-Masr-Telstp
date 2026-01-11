import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Bot, Mic, Languages, Clock, CheckCircle, Play, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { generateScript, generateIntro, chatWithAI } from '@/services/mistralService';

interface AIHost {
  id: string;
  name: string;
  avatar: string;
  role: string;
  languages: string[];
  specialty: string;
  status: 'active' | 'idle' | 'busy';
  tasksCompleted: number;
  currentTask?: string;
}

export default function AIAgentManager() {
  const [selectedHost, setSelectedHost] = useState<string>('');
  const [taskType, setTaskType] = useState<string>('');
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  const aiHosts: AIHost[] = [
    {
      id: '1',
      name: 'Dr. Amira Hassan',
      avatar: 'https://d64gsuwffb70l.cloudfront.net/68bf9d4eab4ef54ccf5391b5_1757388176912_a4783b35.webp',
      role: 'Science Correspondent',
      languages: ['Arabic', 'English', 'French'],
      specialty: 'Biotechnology & Research',
      status: 'active',
      tasksCompleted: 156,
      currentTask: 'Morning Science Brief'
    },
    {
      id: '2',
      name: 'Prof. Ahmed Khalil',
      avatar: 'https://d64gsuwffb70l.cloudfront.net/68bf9d4eab4ef54ccf5391b5_1757388171055_87a4fa8e.webp',
      role: 'Tech Innovation Host',
      languages: ['English', 'German', 'Spanish'],
      specialty: 'AI & Digital Innovation',
      status: 'idle',
      tasksCompleted: 142
    },
    {
      id: '3',
      name: 'Dr. Sarah Mohamed',
      avatar: 'https://d64gsuwffb70l.cloudfront.net/68bf9d4eab4ef54ccf5391b5_1757388178631_9d455e9c.webp',
      role: 'Global Affairs Host',
      languages: ['French', 'English', 'Arabic'],
      specialty: 'International Collaboration',
      status: 'idle',
      tasksCompleted: 128
    },
    {
      id: '4',
      name: 'Dr. Omar Farouk',
      avatar: 'https://d64gsuwffb70l.cloudfront.net/68bf9d4eab4ef54ccf5391b5_1757388172971_2ab8de79.webp',
      role: 'Evening Program Host',
      languages: ['Arabic', 'English', 'Spanish'],
      specialty: 'Medical Research & Ethics',
      status: 'busy',
      tasksCompleted: 134,
      currentTask: 'Podcast Recording'
    }
  ];

  const taskTypes = [
    { value: 'script', label: 'Generate Script' },
    { value: 'intro', label: 'Generate Intro' },
    { value: 'news', label: 'Process News' },
    { value: 'podcast', label: 'Podcast Script' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleGenerateContent = async () => {
    if (!selectedHost || !taskType || !topic) return;
    
    setIsGenerating(true);
    setGeneratedContent('');
    
    try {
      const host = aiHosts.find(h => h.id === selectedHost);
      
      if (taskType === 'script' || taskType === 'podcast') {
        const result = await generateScript(host?.name || 'AI Host', topic, taskType);
        setGeneratedContent(result.script);
      } else if (taskType === 'intro') {
        const result = await generateIntro(host?.name || 'AI Host', 'Radio Program', topic);
        setGeneratedContent(result.intro);
      }
    } catch (error) {
      console.error('Generation error:', error);
      setGeneratedContent('Error generating content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    
    const newMessages = [...chatMessages, { role: 'user', content: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsChatting(true);
    
    try {
      const host = aiHosts.find(h => h.id === selectedHost);
      const result = await chatWithAI(newMessages, host?.name);
      setChatMessages([...newMessages, { role: 'assistant', content: result.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="space-y-6 mt-6">
      {/* AI Hosts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {aiHosts.map((host) => (
          <Card 
            key={host.id} 
            className={`p-6 bg-slate-800/50 border-cyan-500/20 cursor-pointer transition-all hover:border-cyan-500/50 ${
              selectedHost === host.id ? 'ring-2 ring-cyan-500' : ''
            }`}
            onClick={() => setSelectedHost(host.id)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img 
                  src={host.avatar} 
                  alt={host.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-cyan-500/50"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(host.status)} border-2 border-slate-800`} />
              </div>
              <div>
                <h3 className="text-white font-bold">{host.name}</h3>
                <p className="text-cyan-400 text-sm">{host.role}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">{host.languages.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">{host.specialty}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">{host.tasksCompleted} tasks completed</span>
              </div>
              {host.currentTask && (
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-cyan-300 text-sm">{host.currentTask}</span>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <Badge className={getStatusColor(host.status)}>
                {host.status.charAt(0).toUpperCase() + host.status.slice(1)}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Task Assignment */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-slate-800/50 border-cyan-500/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Generate Content with AI
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Select AI Host</label>
              <Select value={selectedHost} onValueChange={setSelectedHost}>
                <SelectTrigger className="bg-slate-700 border-gray-600 text-white">
                  <SelectValue placeholder="Choose an AI host" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-gray-600">
                  {aiHosts.map((host) => (
                    <SelectItem key={host.id} value={host.id} className="text-white hover:bg-slate-600">
                      {host.name} - {host.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Task Type</label>
              <Select value={taskType} onValueChange={setTaskType}>
                <SelectTrigger className="bg-slate-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-gray-600">
                  {taskTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-white hover:bg-slate-600">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Topic / Content</label>
              <Textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter the topic or content for the AI to process..."
                className="bg-slate-700 border-gray-600 text-white min-h-[100px]"
              />
            </div>
            
            <Button 
              onClick={handleGenerateContent}
              disabled={!selectedHost || !taskType || !topic || isGenerating}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </div>
          
          {generatedContent && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-white font-semibold mb-3">Generated Content:</h3>
              <div className="bg-black/30 p-4 rounded-lg max-h-64 overflow-y-auto">
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">
                  {generatedContent}
                </pre>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                  Copy to Clipboard
                </Button>
                <Button variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                  Save to Library
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* AI Chat */}
        <Card className="p-6 bg-slate-800/50 border-cyan-500/20">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            Chat with AI Assistant
          </h2>
          
          <div className="bg-black/30 rounded-lg h-80 overflow-y-auto p-4 mb-4">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Start a conversation with the AI assistant</p>
                <p className="text-sm mt-2">Ask about content creation, scheduling, or technical help</p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === 'user' 
                          ? 'bg-cyan-500/20 text-cyan-100' 
                          : 'bg-slate-700 text-gray-200'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isChatting && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="bg-slate-700 border-gray-600 text-white min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleChat();
                }
              }}
            />
            <Button 
              onClick={handleChat}
              disabled={!chatInput.trim() || isChatting}
              className="bg-cyan-500 hover:bg-cyan-400"
            >
              Send
            </Button>
          </div>
        </Card>
      </div>

      {/* Task History */}
      <Card className="p-6 bg-slate-800/50 border-cyan-500/20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Recent AI Tasks
        </h2>
        <div className="space-y-3">
          {[
            { host: 'Dr. Amira Hassan', task: 'Morning Brief Script', status: 'completed', time: '2 hours ago' },
            { host: 'Prof. Ahmed Khalil', task: 'Tech News Translation (EN→AR)', status: 'completed', time: '3 hours ago' },
            { host: 'Dr. Sarah Mohamed', task: 'International Report Intro', status: 'completed', time: '5 hours ago' },
            { host: 'Dr. Omar Farouk', task: 'Podcast Episode Script', status: 'in_progress', time: 'In progress' },
            { host: 'Dr. Amira Hassan', task: 'Research Update Processing', status: 'queued', time: 'Queued' },
          ].map((task, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
              <div className="flex items-center gap-4">
                <Bot className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-white font-medium">{task.task}</p>
                  <p className="text-gray-400 text-sm">{task.host}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">{task.time}</span>
                <Badge className={
                  task.status === 'completed' ? 'bg-green-500' :
                  task.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-500'
                }>
                  {task.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
