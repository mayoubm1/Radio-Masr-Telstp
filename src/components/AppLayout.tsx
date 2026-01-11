import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import RadioPlayer from './RadioPlayer';
import AIHostCard from './AIHostCard';
import LanguageSelector from './LanguageSelector';
import ProgramSchedule from './ProgramSchedule';
import NewsCard from './NewsCard';
import LiveChat from './LiveChat';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';
import { 
  Satellite, Zap, Users, Settings, Globe, Radio, Headphones, Clock, MapPin, 
  Mail, Phone, ExternalLink, ChevronRight, MessageCircle, Heart, Bell,
  Play, Pause, Volume2, Menu, X, Mic, Podcast, Calendar, Award
} from 'lucide-react';
import { getCurrentSchedule, ProgramScheduleItem } from '@/services/broadcastService';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const { user, profile } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [schedule, setSchedule] = useState<ProgramScheduleItem[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    loadSchedule();

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (profile?.preferred_language) {
      setSelectedLanguage(profile.preferred_language);
    }
  }, [profile]);

  const loadSchedule = async () => {
    const data = await getCurrentSchedule();
    setSchedule(data);
  };

  const currentProgram = schedule.find(p => p.isActive);

  const aiHosts = [
    {
      name: 'Dr. Amira Hassan',
      avatar: 'https://d64gsuwffb70l.cloudfront.net/68bf9d4eab4ef54ccf5391b5_1757388176912_a4783b35.webp',
      role: 'Science Correspondent',
      languages: ['Arabic', 'English', 'French'],
      isActive: true,
      nextShow: 'Live Now',
      specialty: 'Biotechnology & Research'
    },
    {
      name: 'Prof. Ahmed Khalil',
      avatar: 'https://d64gsuwffb70l.cloudfront.net/68bf9d4eab4ef54ccf5391b5_1757388171055_87a4fa8e.webp',
      role: 'Tech Innovation Host',
      languages: ['English', 'German', 'Spanish'],
      isActive: false,
      nextShow: 'Next: 2:00 PM',
      specialty: 'AI & Digital Innovation'
    },
    {
      name: 'Dr. Sarah Mohamed',
      avatar: 'https://d64gsuwffb70l.cloudfront.net/68bf9d4eab4ef54ccf5391b5_1757388178631_9d455e9c.webp',
      role: 'Global Affairs Host',
      languages: ['French', 'English', 'Arabic'],
      isActive: false,
      nextShow: 'Next: 4:30 PM',
      specialty: 'International Collaboration'
    },
    {
      name: 'Dr. Omar Farouk',
      avatar: 'https://d64gsuwffb70l.cloudfront.net/68bf9d4eab4ef54ccf5391b5_1757388172971_2ab8de79.webp',
      role: 'Evening Program Host',
      languages: ['Arabic', 'English', 'Spanish'],
      isActive: false,
      nextShow: 'Next: 8:00 PM',
      specialty: 'Medical Research & Ethics'
    }
  ];

  const newsData = [
    {
      title: 'Revolutionary Gene Therapy Breakthrough at TELsTP',
      excerpt: 'Scientists at Tawasol Egypt Life Science Technology Park achieve major milestone in gene editing research.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68bf9d4eab4ef54ccf5391b5_1757388183493_bdf862d3.webp',
      date: '2026-01-08',
      category: 'Research',
      location: 'Cairo, Egypt'
    },
    {
      title: 'International Collaboration Expands Global Network',
      excerpt: 'New partnerships with leading European and American research institutions strengthen TELsTP\'s position.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68bf9d4eab4ef54ccf5391b5_1757388185229_14bf7560.webp',
      date: '2026-01-05',
      category: 'Partnership',
      location: 'Global'
    },
    {
      title: 'Advanced AI Lab Opens New Research Possibilities',
      excerpt: 'State-of-the-art artificial intelligence laboratory equipped with quantum computing capabilities.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68bf9d4eab4ef54ccf5391b5_1757388187417_0d2a09ca.webp',
      date: '2026-01-03',
      category: 'Technology',
      location: 'TELsTP Campus'
    },
    {
      title: 'Sustainable Innovation Initiative Launches',
      excerpt: 'New environmental sustainability program focuses on green technology development.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68bf9d4eab4ef54ccf5391b5_1757388189142_d0dccd0b.webp',
      date: '2026-01-01',
      category: 'Sustainability',
      location: 'TELsTP Campus'
    }
  ];

  const features = [
    { icon: Mic, title: '24/7 Live Broadcasting', description: 'Non-stop science and innovation content' },
    { icon: Globe, title: '5 Languages', description: 'Arabic, English, French, Spanish, German' },
    { icon: Zap, title: 'AI-Powered Hosts', description: 'Intelligent multilingual presenters' },
    { icon: Podcast, title: 'On-Demand Podcasts', description: 'Listen anytime, anywhere' },
    { icon: MessageCircle, title: 'Live Interaction', description: 'Chat with hosts and community' },
    { icon: Award, title: 'Expert Content', description: 'From leading scientists worldwide' }
  ];

  const navLinks = [
    { name: 'Home', href: '#home', section: 'home' },
    { name: 'Listen Live', href: '#player', section: 'player' },
    { name: 'Programs', href: '#schedule', section: 'schedule' },
    { name: 'Hosts', href: '#hosts', section: 'hosts' },
    { name: 'News', href: '#news', section: 'news' },
    { name: 'About', href: '#about', section: 'about' }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-cyan-500/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Radio className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Radio TELsTP
                </h1>
                <p className="text-xs text-gray-400">Tawasol Egypt</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.section)}
                  className={`text-sm font-medium transition-colors ${
                    activeSection === link.section 
                      ? 'text-cyan-400' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Live Indicator */}
              <div className="hidden md:flex items-center gap-2 bg-red-500/20 border border-red-500/50 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 text-xs font-semibold">LIVE</span>
              </div>

              {/* Time */}
              <div className="hidden md:flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* Chat Toggle */}
              <button
                onClick={() => setShowChat(!showChat)}
                className="relative p-2 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                {user && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full text-[10px] flex items-center justify-center text-white">
                    3
                  </span>
                )}
              </button>

              {/* User Menu */}
              <UserMenu onOpenAuth={() => setShowAuthModal(true)} />

              {/* Admin Button */}
              {user && (
                <button
                  onClick={() => navigate('/admin')}
                  className="hidden md:flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 px-3 py-1.5 rounded-lg text-sm transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.section)}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {link.name}
                </button>
              ))}
              {user && (
                <button
                  onClick={() => {
                    navigate('/admin');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                >
                  Admin Dashboard
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section 
          id="home"
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url('https://d64gsuwffb70l.cloudfront.net/68bf9d4eab4ef54ccf5391b5_1767881145433_b84cfbdf.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cyan-500/10 rounded-full animate-spin" style={{ animationDuration: '60s' }} />
          </div>

          <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/50 px-4 py-2 rounded-full mb-8">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 font-semibold text-sm">BROADCASTING LIVE 24/7</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                TELsTP
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-cyan-300 font-light mb-2">
              Radio Tawasol Egypt
            </p>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Life Science Technology Park • The Voice of Innovation to the World
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-12">
              <div className="flex items-center gap-2 text-cyan-400 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Satellite className="w-5 h-5" />
                <span className="text-sm">Global Reach</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-400 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Zap className="w-5 h-5" />
                <span className="text-sm">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-400 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Globe className="w-5 h-5" />
                <span className="text-sm">5 Languages</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-400 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Headphones className="w-5 h-5" />
                <span className="text-sm">12,847 Listeners</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => scrollToSection('player')}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30"
              >
                <Play className="w-5 h-5" />
                Listen Now
              </button>
              <LanguageSelector 
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                showTranslation={true}
              />
            </div>

            {/* Current Program Preview */}
            {currentProgram && (
              <div className="mt-12 inline-block bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Radio className="w-5 h-5 text-cyan-400" />
                  <span className="text-cyan-400 font-medium">Now Playing</span>
                </div>
                <h3 className="text-white text-xl font-bold">{currentProgram.title}</h3>
                <p className="text-gray-400">Host: {currentProgram.host}</p>
              </div>
            )}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronRight className="w-8 h-8 text-cyan-400 rotate-90" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-gray-950 to-blue-950/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Listen to Radio TELsTP?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Experience the future of science broadcasting with cutting-edge technology and world-class content.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-cyan-500/50 transition-all hover:transform hover:scale-105 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2 text-sm">{feature.title}</h3>
                  <p className="text-gray-400 text-xs">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Radio Player Section */}
        <section id="player" className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <RadioPlayer 
                  isLive={true}
                  currentHost={currentProgram?.host || "Dr. Amira Hassan"}
                  currentProgram={currentProgram?.title || "Morning Science Brief"}
                  listeners={12847}
                />
              </div>
              <div>
                <LiveChat 
                  programName={currentProgram?.title || "Main Broadcast"}
                  isMinimized={false}
                />
              </div>
            </div>
          </div>
        </section>

        {/* AI Hosts Section */}
        <section id="hosts" className="py-20 bg-gradient-to-b from-blue-950/50 to-gray-950">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Meet Our AI Hosts
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our multilingual AI hosts deliver content in 5 languages, providing real-time translation and engaging presentations around the clock.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiHosts.map((host, index) => (
                <AIHostCard key={index} {...host} />
              ))}
            </div>
          </div>
        </section>

        {/* Schedule Section */}
        <section id="schedule" className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <ProgramSchedule />
          </div>
        </section>

        {/* News Section */}
        <section id="news" className="py-20 bg-gradient-to-b from-gray-950 to-blue-950/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Latest from TELsTP
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Stay updated with the latest research breakthroughs, partnerships, and innovations.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {newsData.map((news, index) => (
                <NewsCard key={index} {...news} />
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-2xl p-8 md:p-12 border border-cyan-500/20">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">About Radio TELsTP</h2>
                  <p className="text-gray-300 mb-4">
                    Radio TELsTP is the official broadcasting platform of Tawasol Egypt Life Science Technology Park, 
                    delivering cutting-edge science news, research updates, and innovation stories to a global audience.
                  </p>
                  <p className="text-gray-300 mb-6">
                    Our AI-powered hosts broadcast 24/7 in Arabic, English, French, Spanish, and German, 
                    with real-time translation capabilities to ensure our content reaches every corner of the world.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/30 px-4 py-3 rounded-lg text-center">
                      <p className="text-cyan-400 font-bold text-2xl">24/7</p>
                      <p className="text-gray-400 text-sm">Broadcasting</p>
                    </div>
                    <div className="bg-black/30 px-4 py-3 rounded-lg text-center">
                      <p className="text-cyan-400 font-bold text-2xl">5</p>
                      <p className="text-gray-400 text-sm">Languages</p>
                    </div>
                    <div className="bg-black/30 px-4 py-3 rounded-lg text-center">
                      <p className="text-cyan-400 font-bold text-2xl">4</p>
                      <p className="text-gray-400 text-sm">AI Hosts</p>
                    </div>
                    <div className="bg-black/30 px-4 py-3 rounded-lg text-center">
                      <p className="text-cyan-400 font-bold text-2xl">50+</p>
                      <p className="text-gray-400 text-sm">Countries</p>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src="https://d64gsuwffb70l.cloudfront.net/68bf9d4eab4ef54ccf5391b5_1767881145433_b84cfbdf.jpg"
                    alt="TELsTP Studio"
                    className="rounded-xl shadow-2xl shadow-cyan-500/20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-950 border-t border-gray-800 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Radio className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-cyan-400">Radio TELsTP</h3>
                    <p className="text-gray-400 text-sm">The Voice of Innovation</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Broadcasting science, research, and innovation to the world from Tawasol Egypt Life Science Technology Park.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {['About TELsTP', 'Research Programs', 'Facilities', 'Partnerships', 'Careers', 'Contact Us'].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm flex items-center gap-1">
                        <ChevronRight className="w-3 h-3" />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Programs */}
              <div>
                <h4 className="text-white font-semibold mb-4">Programs</h4>
                <ul className="space-y-2">
                  {['Morning Science Brief', 'Innovation Hour', 'Global Research Roundup', 'Tech Talk TELsTP', 'Evening Science Show'].map((program) => (
                    <li key={program}>
                      <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                        {program}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    Cairo, Egypt
                  </li>
                  <li className="flex items-center gap-2 text-gray-400 text-sm">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    radio@telstp.org
                  </li>
                  <li className="flex items-center gap-2 text-gray-400 text-sm">
                    <Phone className="w-4 h-4 text-cyan-400" />
                    +20 2 1234 5678
                  </li>
                  <li className="flex items-center gap-2 text-gray-400 text-sm">
                    <ExternalLink className="w-4 h-4 text-cyan-400" />
                    www.telstp.org
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-sm">
                © 2026 Radio TELsTP - Tawasol Egypt Life Science Technology Park. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-gray-500 text-sm">Powered by</span>
                <span className="text-cyan-400 text-sm font-medium">Mistral AI</span>
                <span className="text-gray-600">•</span>
                <span className="text-purple-400 text-sm font-medium">Supabase</span>
                <span className="text-gray-600">•</span>
                <span className="text-green-400 text-sm font-medium">Agora</span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Floating Chat Button (when chat is closed) */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 rounded-full shadow-lg shadow-cyan-500/30 hover:scale-110 transition-transform z-40 lg:hidden"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Chat Overlay */}
      {showChat && isMobile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end">
          <div className="w-full h-[80vh] bg-gray-900 rounded-t-2xl overflow-hidden">
            <LiveChat 
              programName={currentProgram?.title || "Main Broadcast"}
              onToggle={() => setShowChat(false)}
            />
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default AppLayout;
