import React, { useState, useEffect } from 'react';
import { Search, Bell, ExternalLink, ShieldCheck, Check } from 'lucide-react';

const Header = ({ searchQuery, setSearchQuery, inquiries, onSelectInquiry }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const newInquiries = inquiries.filter(i => i.status === 'New');

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-border-gray px-6 py-3 flex items-center justify-between gap-4 shadow-xs">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search inquiries, projects, clients, IDs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue focus:ring-2 focus:ring-corporate-blue/10 transition-all placeholder:text-text-muted"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-text-primary px-1.5 py-0.5 rounded bg-gray-200"
          >
            Esc
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Real-time Indian Standard Time */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-light-bg rounded-lg border border-border-gray text-xs font-mono text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>IST: {currentTime || '17:15:00'}</span>
        </div>

        {/* Public Website Link */}
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-corporate-blue bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
          title="Open Public Portal (Port 5173)"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-text-secondary hover:text-corporate-blue hover:bg-light-bg rounded-xl border border-transparent hover:border-border-gray transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {newInquiries.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-orange rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-border-gray p-4 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-border-gray mb-3">
                <div className="font-semibold text-sm text-text-primary">
                  New Inquiries ({newInquiries.length})
                </div>
                <span className="text-[11px] font-medium text-brand-orange bg-orange-50 px-2 py-0.5 rounded-full">
                  Action Required
                </span>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {newInquiries.length === 0 ? (
                  <div className="py-6 text-center text-xs text-text-muted">
                    <Check className="w-6 h-6 mx-auto mb-1 text-emerald-500" />
                    All inquiries are currently handled!
                  </div>
                ) : (
                  newInquiries.slice(0, 5).map((inq) => (
                    <div
                      key={inq.id}
                      onClick={() => {
                        onSelectInquiry(inq);
                        setShowNotifications(false);
                      }}
                      className="p-2.5 rounded-xl hover:bg-light-bg cursor-pointer transition-colors border border-border-gray/50"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-text-primary">
                        <span>{inq.fullName}</span>
                        <span className="text-[10px] font-mono text-corporate-blue">{inq.id}</span>
                      </div>
                      <p className="text-[11px] text-text-muted truncate mt-0.5">{inq.subject}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
