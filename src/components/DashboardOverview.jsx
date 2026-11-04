import React from 'react';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  FolderKanban, 
  ArrowUpRight, 
  Leaf, 
  SunMedium, 
  Landmark, 
  Network, 
  Briefcase,
  ChevronRight,
  TrendingUp,
  Plus
} from 'lucide-react';
import { DIVISIONS } from '../data/mockData';

const iconMap = {
  sustainability: Leaf,
  renewable: SunMedium,
  government: Landmark,
  network: Network,
  consultancy: Briefcase,
};

const DashboardOverview = ({ 
  inquiries, 
  projects, 
  onSelectCategory, 
  onSelectInquiry, 
  onNewInquiry,
  onNewProject,
  onViewProjects 
}) => {
  const newCount = inquiries.filter(i => i.status === 'New').length;
  const inReviewCount = inquiries.filter(i => i.status === 'In Review').length;
  const closedCount = inquiries.filter(i => ['Approved', 'Contacted'].includes(i.status)).length;

  const getDivisionStats = (divId) => {
    const divInquiries = inquiries.filter(i => i.divisionId === divId);
    const divProjects = projects.filter(p => p.divisionId === divId);
    const newItems = divInquiries.filter(i => i.status === 'New').length;
    return {
      totalInquiries: divInquiries.length,
      newItems,
      totalProjects: divProjects.length
    };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-corporate-blue via-navy-blue to-corporate-blue text-white rounded-3xl p-7 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-orange text-xs font-semibold mb-3 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping"></span>
              Jayarams Bharat Executive Dashboard
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Enterprise Division &amp; Operations Command
            </h2>
            <p className="text-blue-100/90 text-sm mt-2 leading-relaxed">
              Consolidated central management for all 5 core engineering divisions of Jayarams Bharat Private Limited. Manage stakeholder inquiries, division assets, and national execution portfolios.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNewInquiry}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Log Manual Inquiry</span>
            </button>
            <button
              onClick={onNewProject}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all active:scale-95"
            >
              <FolderKanban className="w-4 h-4" />
              <span>Add Project Showcase</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-border-gray shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Total Enquiries
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-corporate-blue flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-corporate-blue">{inquiries.length}</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{inquiries.length > 0 ? 'Active across all divisions' : 'Intake channels standby'}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-border-gray shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              New / Unhandled
            </span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-brand-orange">{newCount}</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-orange font-medium">
            <span>{newCount > 0 ? 'Requires administrative action' : 'All divisions up to date'}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-border-gray shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              In Review &amp; Contacted
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-text-primary">{inReviewCount + closedCount}</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-text-muted font-medium">
            <span>{inReviewCount + closedCount > 0 ? 'Active proposal discussions' : 'Pipeline standing by'}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-border-gray shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Project Showcase Assets
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-text-primary">{projects.length}</div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Verified division showcases</span>
          </div>
        </div>
      </div>

      {/* 5 Core Division Categories Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-lg font-bold text-text-primary tracking-tight">
              Five Core Division Categories
            </h3>
            <p className="text-xs text-text-secondary">
              Direct intake channels and operational oversight for all 5 specialized engineering divisions.
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-semibold text-corporate-blue hover:text-brand-orange flex items-center gap-1 self-start sm:self-auto transition-colors"
          >
            <span>View All Inquiries Table</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DIVISIONS.map((division) => {
            const Icon = iconMap[division.id] || FolderKanban;
            const stats = getDivisionStats(division.id);

            return (
              <div
                key={division.id}
                className="bg-white rounded-2xl p-6 border border-border-gray hover:border-corporate-blue/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Division Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105"
                      style={{ backgroundColor: division.bgColor, color: division.themeColor }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {stats.newItems > 0 && (
                        <span className="text-[10px] font-bold text-brand-orange bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                          {stats.newItems} New
                        </span>
                      )}
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-gray-100 text-text-secondary">
                        {division.code}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-text-primary group-hover:text-corporate-blue transition-colors leading-snug">
                    {division.name}
                  </h4>
                  <p className="text-xs text-text-muted mt-2 leading-relaxed line-clamp-2">
                    {division.description}
                  </p>

                  {/* Division Desk */}
                  <div className="mt-3 text-[11px] text-text-secondary flex items-center gap-1.5">
                    <span className="font-medium text-text-muted">Desk:</span>
                    <span className="font-semibold text-text-primary">{division.leadName}</span>
                  </div>
                </div>

                {/* Card Footer Metrics & Action */}
                <div className="mt-5 pt-4 border-t border-border-gray flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-[10px] text-text-muted uppercase block leading-none">Inquiries</span>
                      <span className="text-base font-extrabold text-corporate-blue">{stats.totalInquiries}</span>
                    </div>
                    <div className="h-6 w-px bg-border-gray"></div>
                    <div>
                      <span className="text-[10px] text-text-muted uppercase block leading-none">Showcases</span>
                      <span className="text-base font-bold text-text-primary">{stats.totalProjects}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCategory(division.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-light-bg hover:bg-corporate-blue hover:text-white text-corporate-blue transition-all"
                  >
                    <span>View Category</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Recent Inquiries + Featured Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Recent Inquiries (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-border-gray shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-base text-text-primary">Recent Inquiries Stream</h3>
              <p className="text-xs text-text-secondary">Incoming submissions from division desks</p>
            </div>
            {inquiries.length > 0 && (
              <button
                onClick={() => onSelectCategory('all')}
                className="text-xs font-semibold text-corporate-blue hover:text-brand-orange flex items-center gap-1"
              >
                <span>View All ({inquiries.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {inquiries.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-border-gray bg-light-bg/40 text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-corporate-blue flex items-center justify-center mx-auto mb-3">
                  <Inbox className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-text-primary">No Inquiries Logged Yet</h4>
                <p className="text-xs text-text-muted mt-1 max-w-md mx-auto leading-relaxed">
                  The inquiry database is clean with zero dummy submissions. As clients submit inquiries through the division portals or as you log manual client interactions, they will appear here.
                </p>
                <button
                  onClick={onNewInquiry}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Manual Inquiry</span>
                </button>
              </div>
            ) : (
              inquiries.slice(0, 5).map((inquiry) => {
                const division = DIVISIONS.find(d => d.id === inquiry.divisionId);
                const statusColors = {
                  'New': 'bg-orange-50 text-brand-orange border-orange-200',
                  'In Review': 'bg-blue-50 text-corporate-blue border-blue-200',
                  'Contacted': 'bg-purple-50 text-purple-700 border-purple-200',
                  'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                };

                return (
                  <div
                    key={inquiry.id}
                    onClick={() => onSelectInquiry(inquiry)}
                    className="p-4 rounded-xl border border-border-gray/70 hover:border-corporate-blue/50 hover:bg-light-bg/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-text-primary group-hover:text-corporate-blue transition-colors">
                          {inquiry.fullName}
                        </span>
                        <span className="text-[11px] text-text-muted">• {inquiry.organization}</span>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: division?.bgColor, color: division?.themeColor }}
                        >
                          {division?.shortName}
                        </span>
                      </div>
                      <div className="text-xs text-text-secondary line-clamp-1 font-medium">
                        {inquiry.subject}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span className="text-xs font-bold font-mono text-corporate-blue">
                        {inquiry.projectScale}
                      </span>
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${statusColors[inquiry.status] || 'bg-gray-100 text-gray-700'}`}>
                        {inquiry.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-corporate-blue transition-colors" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Featured Project Showcase Images (1 Col) */}
        <div className="bg-white rounded-2xl p-6 border border-border-gray shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-text-primary">Project Showcase</h3>
                <p className="text-xs text-text-secondary">Authentic division portfolio</p>
              </div>
              <button
                onClick={onViewProjects}
                className="text-xs font-semibold text-corporate-blue hover:text-brand-orange flex items-center gap-1"
              >
                <span>Gallery ({projects.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => {
                const division = DIVISIONS.find(d => d.id === project.divisionId);
                return (
                  <div
                    key={project.id}
                    onClick={onViewProjects}
                    className="group cursor-pointer rounded-xl overflow-hidden border border-border-gray hover:border-corporate-blue/40 transition-all"
                  >
                    <div className="h-28 w-full overflow-hidden relative">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span
                        className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md bg-white/90 text-text-primary shadow-xs"
                      >
                        {division?.shortName}
                      </span>
                      <span className="absolute bottom-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-black/60 text-white font-mono">
                        {project.capacity}
                      </span>
                    </div>
                    <div className="p-3 bg-white">
                      <h5 className="font-semibold text-xs text-text-primary group-hover:text-corporate-blue line-clamp-1">
                        {project.title}
                      </h5>
                      <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">
                        {project.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={onNewProject}
            className="w-full mt-4 py-2 text-xs font-semibold text-corporate-blue bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload New Project Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
