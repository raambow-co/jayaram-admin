import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  FolderKanban, 
  BarChart3, 
  Settings, 
  Leaf, 
  SunMedium, 
  Landmark, 
  Network, 
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import { DIVISIONS } from '../data/mockData';

const divisionIconMap = {
  sustainability: Leaf,
  renewable: SunMedium,
  government: Landmark,
  network: Network,
  consultancy: Briefcase,
};

const Sidebar = ({ currentView, setCurrentView, selectedCategory, setSelectedCategory, inquiries, projects }) => {
  const getCategoryCount = (divId) => {
    return inquiries.filter(i => i.divisionId === divId).length;
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'enquiries', label: 'Division Enquiries', icon: Inbox, badge: inquiries.length },
    { id: 'projects', label: 'Project Showcase Assets', icon: FolderKanban, badge: projects.length },
    { id: 'analytics', label: 'Analytics & Pipeline', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Database', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-white border-r border-border-gray flex flex-col shrink-0 h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-border-gray flex items-center gap-3">
        <div className="p-1 rounded-xl bg-slate-50 border border-border-gray shadow-xs">
          <img 
            src="/logo.webp" 
            alt="Jayarams Bharat" 
            className="h-9 w-auto object-contain"
            onError={(e) => { e.currentTarget.src = '/logo.png'; }}
          />
        </div>
        <div>
          <h1 className="font-bold text-sm text-corporate-blue tracking-tight leading-none uppercase">
            Jayarams Bharat
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-orange bg-orange-50 px-1.5 py-0.5 rounded">
              Admin Portal
            </span>
            <span className="text-[11px] text-text-muted">v2.5</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted px-3 mb-2">
            Main Management
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    if (item.id === 'enquiries' && selectedCategory === null) {
                      setSelectedCategory('all');
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-corporate-blue text-white shadow-sm shadow-corporate-blue/20'
                      : 'text-text-secondary hover:text-text-primary hover:bg-light-bg'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-orange' : 'text-text-muted'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-text-secondary'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* 5 Categories Shortcut */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              5 Core Divisions
            </span>
            <span className="text-[10px] font-semibold text-corporate-blue bg-blue-50 px-1.5 py-0.2 rounded">
              Active
            </span>
          </div>
          <div className="space-y-1">
            {DIVISIONS.map((division) => {
              const Icon = divisionIconMap[division.id] || Briefcase;
              const count = getCategoryCount(division.id);
              const isSelected = currentView === 'enquiries' && selectedCategory === division.id;

              return (
                <button
                  key={division.id}
                  onClick={() => {
                    setCurrentView('enquiries');
                    setSelectedCategory(division.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left ${
                    isSelected
                      ? 'bg-brand-orange/10 text-corporate-blue font-bold border border-brand-orange/30'
                      : 'text-text-secondary hover:text-text-primary hover:bg-light-bg'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: division.themeColor }}
                    />
                    <Icon className="w-3.5 h-3.5 shrink-0 text-text-muted" />
                    <span className="truncate">{division.shortName}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-brand-orange text-white' : 'bg-gray-100 text-text-muted'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Audit / Status Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-corporate-blue to-navy-blue text-white shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-brand-orange" />
            <span className="text-xs font-bold">Engineering Quality &amp; EPC Standards</span>
          </div>
          <p className="text-[11px] text-blue-100 leading-relaxed mb-3">
            Multi-division turnkey execution across renewable energies, environmental infrastructure, and surveillance backbones.
          </p>
          <div className="flex items-center justify-between text-[10px] pt-2 border-t border-white/10 font-mono text-blue-200">
            <span>Data State: Clean</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Ready
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-border-gray bg-light-bg/50 text-[11px] text-text-muted flex items-center justify-between">
        <span>Jayarams Bharat &copy; 2026</span>
        <span className="font-mono text-[10px] text-corporate-blue font-semibold">HQ: Hyderabad, India</span>
      </div>
    </aside>
  );
};

export default Sidebar;
