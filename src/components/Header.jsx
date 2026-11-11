import React, { useState, useEffect, useMemo } from 'react';
import { Search, ExternalLink } from 'lucide-react';

const Header = ({ searchQuery, setSearchQuery, inquiries = [], onSelectInquiry }) => {
  const [currentTime, setCurrentTime] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery || !searchQuery.trim() || !Array.isArray(inquiries)) return [];
    const q = searchQuery.toLowerCase().trim();
    return inquiries.filter(i => 
      (i.fullName && i.fullName.toLowerCase().includes(q)) ||
      (i.id && i.id.toLowerCase().includes(q)) ||
      (i.organization && i.organization.toLowerCase().includes(q)) ||
      (i.location && i.location.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [searchQuery, inquiries]);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-border-gray px-6 py-3 flex items-center justify-between gap-4 shadow-xs">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search inquiries, projects, clients, IDs..."
          value={searchQuery}
          onFocus={() => setShowDropdown(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          className="w-full pl-10 pr-4 py-2 text-sm bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue focus:ring-2 focus:ring-corporate-blue/10 transition-all placeholder:text-text-muted"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setShowDropdown(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-text-primary px-1.5 py-0.5 rounded bg-gray-200"
          >
            Esc
          </button>
        )}

        {/* Live Search Quick Results Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-border-gray p-2 z-50 space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Matching Inquiries ({searchResults.length})
            </div>
            {searchResults.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  if (onSelectInquiry) onSelectInquiry(item);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-bold text-text-primary">{item.fullName}</div>
                  <div className="text-[11px] text-text-muted truncate">{item.organization || item.location || item.id}</div>
                </div>
                <span className="text-[10px] font-mono font-bold text-corporate-blue bg-blue-50 px-2 py-0.5 rounded">
                  {item.id}
                </span>
              </button>
            ))}
          </div>
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
          href="https://jayaramsbharat.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-corporate-blue bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
          title="Open Public Website (jayaramsbharat.com)"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </header>
  );
};

export default Header;
