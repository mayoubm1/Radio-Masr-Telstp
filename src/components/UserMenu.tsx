import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Settings, Heart, Bell, LogOut, Globe, ChevronDown } from 'lucide-react';

interface UserMenuProps {
  onOpenAuth: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onOpenAuth }) => {
  const { user, profile, signOut, updatePreferences } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' }
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const handleLanguageChange = async (language: string) => {
    await updatePreferences(language, profile?.notification_enabled ?? true);
  };

  const handleNotificationToggle = async () => {
    await updatePreferences(
      profile?.preferred_language ?? 'en',
      !profile?.notification_enabled
    );
  };

  if (!user) {
    return (
      <button
        onClick={onOpenAuth}
        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30"
      >
        <User className="w-4 h-4" />
        Sign In
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-black/30 hover:bg-black/50 px-3 py-2 rounded-lg transition-colors"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name || 'User'}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="text-white text-sm hidden md:block">
          {profile?.display_name || user.email?.split('@')[0]}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-72 bg-gray-900 rounded-xl shadow-xl border border-gray-700 overflow-hidden z-50">
            {/* User Info */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name || 'User'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <p className="text-white font-medium">
                    {profile?.display_name || 'User'}
                  </p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span>Preferences</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showPreferences ? 'rotate-180' : ''}`} />
              </button>

              {showPreferences && (
                <div className="ml-8 mt-2 space-y-2">
                  {/* Language Preference */}
                  <div className="px-3 py-2">
                    <label className="text-xs text-gray-500 mb-2 block">Preferred Language</label>
                    <select
                      value={profile?.preferred_language || 'en'}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notifications Toggle */}
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">Notifications</span>
                    </div>
                    <button
                      onClick={handleNotificationToggle}
                      className={`w-10 h-6 rounded-full transition-colors ${
                        profile?.notification_enabled ? 'bg-cyan-500' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          profile?.notification_enabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                <Heart className="w-5 h-5 text-gray-400" />
                <span>Favorite Programs</span>
              </button>

              <div className="border-t border-gray-700 mt-2 pt-2">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
