import React, { useState, useMemo } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  MapPin, 
  Building2, 
  Maximize2, 
  Trash2, 
  Leaf, 
  SunMedium, 
  Landmark, 
  Network, 
  Briefcase, 
  X, 
  Layers 
} from 'lucide-react';
import { DIVISIONS } from '../data/mockData';

const iconMap = {
  sustainability: Leaf,
  renewable: SunMedium,
  government: Landmark,
  network: Network,
  consultancy: Briefcase,
};

const ProjectsManager = ({ 
  projects, 
  onNewProject, 
  onDeleteProject, 
  showToast 
}) => {
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [previewImage, setPreviewImage] = useState(null); // Fullscreen lightbox

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (selectedDivision !== 'all' && project.divisionId !== selectedDivision) {
        return false;
      }
      if (statusFilter !== 'All' && project.status !== statusFilter) {
        return false;
      }
      if (search.trim()) {
        const query = search.toLowerCase();
        const match =
          project.title.toLowerCase().includes(query) ||
          project.client.toLowerCase().includes(query) ||
          project.location.toLowerCase().includes(query) ||
          project.capacity.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query);
        if (!match) return false;
      }
      return true;
    });
  }, [projects, selectedDivision, statusFilter, search]);

  const handleDelete = (id, title) => {
    if (confirm(`Are you sure you want to remove "${title}" from the public showcase?`)) {
      onDeleteProject(id);
      showToast(`Removed "${title}" successfully`, 'info');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Action */}
      <div className="bg-white p-6 rounded-3xl border border-border-gray shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Asset &amp; Showcase Portfolio
          </div>
          <h2 className="text-xl font-bold text-text-primary">
            Project Images &amp; Engineering Showcase
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Manage high-resolution execution photos, capacity metrics, and client accreditations across all 5 divisions.
          </p>
        </div>

        <button
          onClick={onNewProject}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Project Image</span>
        </button>
      </div>

      {/* Division Category Selector Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-border-gray shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => setSelectedDivision('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedDivision === 'all'
                ? 'bg-corporate-blue text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary hover:bg-light-bg'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>All Division Images</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedDivision === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-text-muted'}`}>
              {projects.length}
            </span>
          </button>

          {DIVISIONS.map((division) => {
            const Icon = iconMap[division.id] || FolderKanban;
            const count = projects.filter(p => p.divisionId === division.id).length;
            const isSelected = selectedDivision === division.id;

            return (
              <button
                key={division.id}
                onClick={() => setSelectedDivision(division.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-light-bg'
                }`}
                style={{
                  backgroundColor: isSelected ? division.themeColor : 'transparent',
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{division.shortName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-text-muted'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-border-gray shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, client, location, capacity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span className="text-text-muted">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-light-bg border border-border-gray rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-corporate-blue"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Execution">In Execution</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const division = DIVISIONS.find(d => d.id === project.divisionId);

          return (
            <div
              key={project.id}
              className="bg-white rounded-3xl border border-border-gray overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Container with Zoom Trigger */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none"></div>

                  {/* Division Badge on Top Left */}
                  <span
                    className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs text-white"
                    style={{ backgroundColor: `${division?.themeColor}E6` }}
                  >
                    {division?.shortName}
                  </span>

                  {/* Zoom Preview Button on Top Right */}
                  <button
                    onClick={() => setPreviewImage(project)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-white/80 hover:bg-white text-text-primary backdrop-blur-md shadow-xs transition-colors"
                    title="Expand Fullscreen Image"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Capacity & Status at bottom of image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                    <span className="font-mono font-bold bg-black/50 backdrop-blur-md px-2 py-0.5 rounded">
                      {project.capacity}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      project.status === 'Completed' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] text-text-muted mb-1.5 font-mono">
                    <span>{project.id}</span>
                    <span>Target: {project.completionDate}</span>
                  </div>

                  <h3 className="font-bold text-sm text-text-primary leading-snug group-hover:text-corporate-blue transition-colors line-clamp-2">
                    {project.title}
                  </h3>

                  <p className="text-xs text-text-secondary mt-2 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border-gray/70 space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Building2 className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <span className="font-semibold text-text-primary truncate">{project.client}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-muted">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-light-bg/50 border-t border-border-gray flex items-center justify-between">
                <button
                  onClick={() => setPreviewImage(project)}
                  className="text-xs font-semibold text-corporate-blue hover:text-brand-orange flex items-center gap-1 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Inspect Image</span>
                </button>

                <button
                  onClick={() => handleDelete(project.id, project.title)}
                  className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove from Showcase"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={previewImage.imageUrl}
                alt={previewImage.title}
                className="max-h-[60vh] w-auto object-contain"
              />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-corporate-blue px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200">
                  {previewImage.id}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {previewImage.status} ({previewImage.completionDate})
                </span>
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                {previewImage.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {previewImage.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border-gray text-xs">
                <div>
                  <span className="text-text-muted block text-[10px] uppercase font-bold">Client Authority</span>
                  <span className="font-semibold text-text-primary">{previewImage.client}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] uppercase font-bold">Site Location</span>
                  <span className="font-semibold text-text-primary">{previewImage.location}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] uppercase font-bold">Technical Scale</span>
                  <span className="font-mono font-bold text-brand-orange">{previewImage.capacity}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
