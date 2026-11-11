import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  Calendar, 
  Building2, 
  MapPin, 
  Eye, 
  Leaf, 
  SunMedium, 
  Landmark, 
  Network, 
  Briefcase,
  Layers,
  AlertCircle,
  Inbox
} from 'lucide-react';
import { DIVISIONS } from '../data/mockData';

const iconMap = {
  sustainability: Leaf,
  renewable: SunMedium,
  government: Landmark,
  network: Network,
  consultancy: Briefcase,
};

const EnquiriesManager = ({
  inquiries,
  selectedCategory,
  onSelectCategory,
  onSelectInquiry,
  onStatusChange,
  onNewInquiry,
  showToast
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');

  // Filter inquiries based on category, search, status, urgency
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) => {
      // Category filter
      if (selectedCategory && selectedCategory !== 'all' && inquiry.divisionId !== selectedCategory) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'All' && inquiry.status !== statusFilter) {
        return false;
      }
      // Urgency filter
      if (urgencyFilter !== 'All' && inquiry.urgency !== urgencyFilter) {
        return false;
      }
      // Search term
      if (search.trim()) {
        const query = search.toLowerCase();
        const match =
          inquiry.fullName?.toLowerCase().includes(query) ||
          inquiry.organization?.toLowerCase().includes(query) ||
          inquiry.email?.toLowerCase().includes(query) ||
          inquiry.subject?.toLowerCase().includes(query) ||
          inquiry.id?.toLowerCase().includes(query) ||
          inquiry.location?.toLowerCase().includes(query);
        if (!match) return false;
      }
      return true;
    });
  }, [inquiries, selectedCategory, statusFilter, urgencyFilter, search]);

  const activeDivision = selectedCategory !== 'all' 
    ? DIVISIONS.find(d => d.id === selectedCategory) 
    : null;

  // Export to CSV function
  const handleExportCSV = () => {
    if (filteredInquiries.length === 0) {
      showToast('No inquiries available to export.', 'error');
      return;
    }

    const headers = ['Inquiry ID', 'Division', 'Full Name', 'Organization', 'Email', 'Phone', 'Location', 'Scale', 'Urgency', 'Status', 'Date', 'Subject'];
    const rows = filteredInquiries.map(inq => {
      const divName = DIVISIONS.find(d => d.id === inq.divisionId)?.name || inq.divisionId;
      return [
        `"${inq.id || ''}"`,
        `"${divName}"`,
        `"${(inq.fullName || '').replace(/"/g, '""')}"`,
        `"${(inq.organization || '').replace(/"/g, '""')}"`,
        `"${inq.email || ''}"`,
        `"${inq.phone || ''}"`,
        `"${(inq.location || '').replace(/"/g, '""')}"`,
        `"${inq.projectScale || ''}"`,
        `"${inq.urgency || ''}"`,
        `"${inq.status || ''}"`,
        `"${inq.submittedAt || ''}"`,
        `"${(inq.subject || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jayarams_inquiries_${selectedCategory || 'all'}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filteredInquiries.length} inquiries to CSV`, 'success');
  };

  const statusColors = {
    'New': 'bg-orange-50 text-brand-orange border-orange-200',
    'In Review': 'bg-blue-50 text-corporate-blue border-blue-200',
    'Contacted': 'bg-purple-50 text-purple-700 border-purple-200',
    'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Closed': 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const urgencyColors = {
    'High': 'text-red-600 bg-red-50 border-red-200',
    'Medium': 'text-amber-600 bg-amber-50 border-amber-200',
    'Standard': 'text-blue-600 bg-blue-50 border-blue-200',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="bg-white p-6 rounded-3xl border border-border-gray shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-corporate-blue text-[11px] font-bold mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Division Intake Desk</span>
          </div>
          <h2 className="text-xl font-bold text-text-primary">
            Division Inquiries Management
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Filter by division category, manage lifecycle stages, and review client tender specifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary bg-light-bg hover:bg-gray-200/70 border border-border-gray rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onNewInquiry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Log Manual Inquiry</span>
          </button>
        </div>
      </div>

      {/* Division Category Selector Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-border-gray shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            onClick={() => onSelectCategory('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-corporate-blue text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary hover:bg-light-bg'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Categories</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-text-muted'}`}>
              {inquiries.length}
            </span>
          </button>

          {DIVISIONS.map((div) => {
            const Icon = iconMap[div.id] || Layers;
            const count = inquiries.filter(i => i.divisionId === div.id).length;
            const isSelected = selectedCategory === div.id;

            return (
              <button
                key={div.id}
                onClick={() => onSelectCategory(div.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-corporate-blue text-white shadow-xs'
                    : 'text-text-secondary hover:text-text-primary hover:bg-light-bg'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{div.shortName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-text-muted'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-border-gray shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by stakeholder, organization, subject, ID, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-light-bg border border-border-gray rounded-xl text-xs focus:outline-none focus:border-corporate-blue"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-light-bg border border-border-gray rounded-xl text-xs font-medium focus:outline-none focus:border-corporate-blue"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="In Review">In Review</option>
              <option value="Contacted">Contacted</option>
              <option value="Approved">Approved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted font-medium">Urgency:</span>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-light-bg border border-border-gray rounded-xl text-xs font-medium focus:outline-none focus:border-corporate-blue"
            >
              <option value="All">All Urgencies</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Standard">Standard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between px-2 text-xs text-text-muted">
        <span>
          Showing <strong>{filteredInquiries.length}</strong> inquiries
          {activeDivision ? ` for ${activeDivision.name}` : ' across all categories'}
        </span>
        {(statusFilter !== 'All' || urgencyFilter !== 'All' || search) && (
          <button
            onClick={() => {
              setStatusFilter('All');
              setUrgencyFilter('All');
              setSearch('');
            }}
            className="text-brand-orange hover:underline font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Main Enquiries Table */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-border-gray shadow-xs">
          {inquiries.length === 0 ? (
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-corporate-blue flex items-center justify-center mx-auto mb-2">
                <Inbox className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-text-primary">No Inquiries in Database</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                The database is reset to a clean state with zero dummy submissions. When stakeholder requests are submitted through the division portals or logged manually, they will appear here.
              </p>
              <button
                onClick={onNewInquiry}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Log Manual Inquiry</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <AlertCircle className="w-10 h-10 mx-auto text-text-muted mb-2" />
              <h4 className="font-bold text-sm text-text-primary">No inquiries match the current filter</h4>
              <p className="text-xs text-text-muted mt-1">Try resetting the status/urgency filters or searching another keyword.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border-gray shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-light-bg/75 border-b border-border-gray text-text-muted uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">ID &amp; Client</th>
                  <th className="py-3.5 px-4">Division Category</th>
                  <th className="py-3.5 px-4">Project Subject</th>
                  <th className="py-3.5 px-4">Scale / Budget</th>
                  <th className="py-3.5 px-4">Urgency</th>
                  <th className="py-3.5 px-4">Status &amp; Flow</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-gray">
                {filteredInquiries.map((inq) => {
                  const division = DIVISIONS.find(d => d.id === inq.divisionId);

                  return (
                    <tr 
                      key={inq.id}
                      className="hover:bg-light-bg/50 transition-colors group cursor-pointer"
                      onClick={() => onSelectInquiry(inq)}
                    >
                      {/* ID & Client */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-mono text-[10px] text-text-muted font-semibold">{inq.id}</div>
                        <div className="font-bold text-text-primary text-xs mt-0.5 group-hover:text-corporate-blue transition-colors">
                          {inq.fullName}
                        </div>
                        <div className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-text-muted shrink-0" />
                          <span className="truncate max-w-[180px]">{inq.organization}</span>
                        </div>
                      </td>

                      {/* Division Badge */}
                      <td className="py-3.5 px-4 align-top">
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                          style={{ backgroundColor: division?.bgColor, color: division?.themeColor }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: division?.themeColor }}></span>
                          {division?.shortName}
                        </span>
                        <div className="text-[10px] text-text-muted mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[140px]">{(inq.location || '').split(',')[0]}</span>
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="py-3.5 px-4 align-top max-w-xs">
                        <div className="font-semibold text-text-primary line-clamp-1">{inq.subject}</div>
                        <div className="text-[11px] text-text-secondary line-clamp-1 mt-0.5">{inq.message}</div>
                        <div className="text-[10px] text-text-muted mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-text-muted" />
                          <span>{inq.submittedAt}</span>
                        </div>
                      </td>

                      {/* Scale */}
                      <td className="py-3.5 px-4 align-top font-mono font-bold text-corporate-blue">
                        {inq.projectScale}
                      </td>

                      {/* Urgency */}
                      <td className="py-3.5 px-4 align-top">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${urgencyColors[inq.urgency] || 'text-gray-600 bg-gray-50'}`}>
                          {inq.urgency}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4 align-top" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={inq.status}
                          onChange={(e) => {
                            onStatusChange(inq.id, e.target.value);
                            showToast(`Updated status of ${inq.id} to ${e.target.value}`);
                          }}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition-colors ${
                            statusColors[inq.status] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="In Review">In Review</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Approved">Approved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>

                      {/* View Action */}
                      <td className="py-3.5 px-4 align-top text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectInquiry(inq);
                          }}
                          className="p-1.5 text-text-muted hover:text-corporate-blue hover:bg-blue-50 rounded-lg transition-colors"
                          title="Open Detailed Inquiry Dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiriesManager;
