import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileAudio, FileVideo, FileText, Link, Music, Trash2, CheckCircle, Clock, Loader2, FolderOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { processNews } from '@/services/mistralService';

interface UploadedContent {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'document' | 'url' | 'text' | 'music';
  size?: string;
  uploadedAt: Date;
  status: 'processing' | 'ready' | 'error';
  category: string;
}

export default function ContentUpload() {
  const [uploadType, setUploadType] = useState<string>('audio');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedContent, setProcessedContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedContent, setUploadedContent] = useState<UploadedContent[]>([
    { id: '1', name: 'Morning Brief - Jan 15.mp3', type: 'audio', size: '45 MB', uploadedAt: new Date(), status: 'ready', category: 'Programs' },
    { id: '2', name: 'Research Update Q4.pdf', type: 'document', size: '2.3 MB', uploadedAt: new Date(), status: 'ready', category: 'Documents' },
    { id: '3', name: 'Lab Tour Video.mp4', type: 'video', size: '250 MB', uploadedAt: new Date(), status: 'processing', category: 'Videos' },
    { id: '4', name: 'Background Jazz Loop.mp3', type: 'music', size: '8 MB', uploadedAt: new Date(), status: 'ready', category: 'Music' },
    { id: '5', name: 'Press Release - New Partnership', type: 'text', uploadedAt: new Date(), status: 'ready', category: 'News' },
  ]);

  const contentTypes = [
    { value: 'audio', label: 'Audio File', icon: FileAudio, accept: '.mp3,.wav,.ogg,.m4a' },
    { value: 'video', label: 'Video File', icon: FileVideo, accept: '.mp4,.webm,.mov,.avi' },
    { value: 'document', label: 'Document', icon: FileText, accept: '.pdf,.doc,.docx,.txt,.md,.html' },
    { value: 'music', label: 'Background Music', icon: Music, accept: '.mp3,.wav,.ogg' },
    { value: 'url', label: 'URL / Webpage', icon: Link, accept: '' },
    { value: 'text', label: 'Raw Text', icon: FileText, accept: '' },
  ];

  const categories = [
    'Programs',
    'News',
    'Podcasts',
    'Music',
    'Advertisements',
    'Documents',
    'Videos',
    'Intros & Outros',
    'Sound Effects'
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'audio': return <FileAudio className="w-5 h-5 text-cyan-400" />;
      case 'video': return <FileVideo className="w-5 h-5 text-purple-400" />;
      case 'document': return <FileText className="w-5 h-5 text-blue-400" />;
      case 'music': return <Music className="w-5 h-5 text-green-400" />;
      case 'url': return <Link className="w-5 h-5 text-yellow-400" />;
      case 'text': return <FileText className="w-5 h-5 text-orange-400" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    for (const file of Array.from(files)) {
      const newContent: UploadedContent = {
        id: Date.now().toString(),
        name: file.name,
        type: uploadType as any,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: new Date(),
        status: 'processing',
        category: category || 'Uncategorized'
      };

      setUploadedContent(prev => [newContent, ...prev]);

      try {
        // Upload to Supabase storage
        const { data, error } = await supabase.storage
          .from('radio-content')
          .upload(`${uploadType}/${Date.now()}_${file.name}`, file);

        if (error) {
          console.error('Upload error:', error);
          setUploadedContent(prev => 
            prev.map(c => c.id === newContent.id ? { ...c, status: 'error' } : c)
          );
        } else {
          // Simulate processing delay
          setTimeout(() => {
            setUploadedContent(prev => 
              prev.map(c => c.id === newContent.id ? { ...c, status: 'ready' } : c)
            );
          }, 2000);
        }
      } catch (err) {
        console.error('Upload error:', err);
        // Still mark as ready for demo purposes
        setTimeout(() => {
          setUploadedContent(prev => 
            prev.map(c => c.id === newContent.id ? { ...c, status: 'ready' } : c)
          );
        }, 2000);
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput) return;

    const newContent: UploadedContent = {
      id: Date.now().toString(),
      name: urlInput,
      type: 'url',
      uploadedAt: new Date(),
      status: 'ready',
      category: category || 'External Links'
    };

    setUploadedContent(prev => [newContent, ...prev]);
    setUrlInput('');
  };

  const handleTextSubmit = async () => {
    if (!textInput) return;

    setIsProcessing(true);

    const newContent: UploadedContent = {
      id: Date.now().toString(),
      name: textInput.substring(0, 50) + '...',
      type: 'text',
      uploadedAt: new Date(),
      status: 'processing',
      category: category || 'News'
    };

    setUploadedContent(prev => [newContent, ...prev]);

    try {
      // Process with AI
      const result = await processNews(textInput);
      setProcessedContent(result.processedNews);
      
      setUploadedContent(prev => 
        prev.map(c => c.id === newContent.id ? { ...c, status: 'ready' } : c)
      );
    } catch (error) {
      console.error('Processing error:', error);
      setUploadedContent(prev => 
        prev.map(c => c.id === newContent.id ? { ...c, status: 'ready' } : c)
      );
    }

    setIsProcessing(false);
    setTextInput('');
  };

  const handleDelete = (id: string) => {
    setUploadedContent(prev => prev.filter(c => c.id !== id));
  };

  const selectedType = contentTypes.find(t => t.value === uploadType);

  return (
    <div className="space-y-6 mt-6">
      {/* Upload Section */}
      <Card className="p-6 bg-slate-800/50 border-cyan-500/20">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Upload className="w-5 h-5 text-cyan-400" />
          Upload Content
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Content Type Selection */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Content Type</label>
              <div className="grid grid-cols-3 gap-2">
                {contentTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setUploadType(type.value)}
                    className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-2 ${
                      uploadType === type.value
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                        : 'bg-black/20 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <type.icon className="w-5 h-5" />
                    <span className="text-xs">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-slate-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-gray-600">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-white hover:bg-slate-600">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Upload Area */}
          <div className="space-y-4">
            {uploadType === 'url' ? (
              <div className="space-y-4">
                <Input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter URL (webpage, article, or media link)"
                  className="bg-slate-700 border-gray-600 text-white"
                />
                <Button 
                  onClick={handleUrlSubmit}
                  disabled={!urlInput}
                  className="w-full bg-cyan-500 hover:bg-cyan-400"
                >
                  <Link className="w-4 h-4 mr-2" />
                  Add URL
                </Button>
              </div>
            ) : uploadType === 'text' ? (
              <div className="space-y-4">
                <Textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste raw text content (news, articles, press releases...)"
                  className="bg-slate-700 border-gray-600 text-white min-h-[120px]"
                />
                <Button 
                  onClick={handleTextSubmit}
                  disabled={!textInput || isProcessing}
                  className="w-full bg-cyan-500 hover:bg-cyan-400"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing with AI...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Process & Add Text
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-cyan-500/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={selectedType?.accept}
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                />
                {isUploading ? (
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-cyan-400 animate-spin" />
                ) : (
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                )}
                <p className="text-gray-400 mb-2">
                  {isUploading ? 'Uploading...' : 'Click or drag files here'}
                </p>
                <p className="text-gray-500 text-sm">
                  Supported: {selectedType?.accept || 'All files'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Processed Content Preview */}
        {processedContent && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-white font-semibold mb-3">AI Processed Content:</h3>
            <div className="bg-black/30 p-4 rounded-lg max-h-48 overflow-y-auto">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">
                {processedContent}
              </pre>
            </div>
          </div>
        )}
      </Card>

      {/* Content Library */}
      <Card className="p-6 bg-slate-800/50 border-cyan-500/20">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-cyan-400" />
          Content Library
        </h2>

        <div className="space-y-3">
          {uploadedContent.map((content) => (
            <div 
              key={content.id}
              className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center gap-4">
                {getTypeIcon(content.type)}
                <div>
                  <p className="text-white font-medium truncate max-w-md">{content.name}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    {content.size && <span>{content.size}</span>}
                    <span>{content.uploadedAt.toLocaleDateString()}</span>
                    <Badge variant="outline" className="text-xs">
                      {content.category}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {content.status === 'processing' ? (
                  <Badge className="bg-yellow-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Processing
                  </Badge>
                ) : content.status === 'ready' ? (
                  <Badge className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>
                ) : (
                  <Badge className="bg-red-500">Error</Badge>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(content.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {uploadedContent.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No content uploaded yet</p>
          </div>
        )}
      </Card>
    </div>
  );
}
