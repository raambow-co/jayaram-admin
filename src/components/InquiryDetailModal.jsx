import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Calendar, 
  Send, 
  FileText, 
  Plus 
} from 'lucide-react';
import { DIVISIONS, COMPANY_INFO } from '../data/mockData';

const InquiryDetailModal = ({ 
  inquiry, 
  onClose, 
  onStatusChange, 
  onAddNote, 
  showToast 
}) => {
  const [newNote, setNewNote] = useState('');
  const [replyDraft, setReplyDraft] = useState('');
  const [showReplyDraft, setShowReplyDraft] = useState(false);

  if (!inquiry) return null;

  const division = DIVISIONS.find(d => d.id === inquiry.divisionId);

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(inquiry.id, newNote.trim());
    setNewNote('');
    showToast('Internal note recorded successfully', 'success');
  };

  const generateDefaultReply = () => {
    const draft = `Dear ${inquiry.fullName},

Thank you for reaching out to ${COMPANY_INFO.name} regarding your inquiry for "${inquiry.subject}".

Our ${division?.name || 'Engineering'} technical desk has reviewed the project parameters (${inquiry.projectScale || 'specified'} estimated scope). We would like to schedule a preliminary technical consultation and review of your requirements.

Could you please confirm your availability for a video conference or site survey this week?

Warm regards,

Executive Operations Directorate
${COMPANY_INFO.name}
Corporate HQ: ${COMPANY_INFO.address}
Desk: ${COMPANY_INFO.phone} | ${COMPANY_INFO.email}
Web: ${COMPANY_INFO.website}`;
    setReplyDraft(draft);
    setShowReplyDraft(true);
  };

  const statusOptions = ['New', 'In Review', 'Contacted', 'Approved', 'Closed'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-blue/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-border-gray w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div 
          className="p-6 border-b flex items-start justify-between gap-4"
          style={{ backgroundColor: division?.bgColor || '#F8FAFC' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white border border-border-gray text-corporate-blue">
                {inquiry.id}
              </span>
              <span
                className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: division?.themeColor, color: '#fff' }}
              >
                {division?.name}
              </span>
              <span className="text-xs text-text-muted flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {inquiry.submittedAt}
              </span>
            </div>
            <h2 className="text-xl font-bold text-text-primary leading-tight">
              {inquiry.subject}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Stakeholder Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-light-bg border border-border-gray/70">
            <div>
              <span className="text-text-muted block text-[10px] uppercase font-bold">Client / Officer</span>
              <span className="font-bold text-text-primary text-sm mt-0.5 block">{inquiry.fullName}</span>
              <span className="text-text-secondary">{inquiry.organization}</span>
            </div>

            <div>
              <span className="text-text-muted block text-[10px] uppercase font-bold">Location</span>
              <div className="flex items-center gap-1 mt-0.5 text-text-primary font-medium">
                <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                <span>{inquiry.location}</span>
              </div>
            </div>

            <div>
              <span className="text-text-muted block text-[10px] uppercase font-bold">Project Scale</span>
              <span className="font-mono font-bold text-corporate-blue text-sm mt-0.5 block">{inquiry.projectScale}</span>
              <span className="text-[10px] font-semibold text-brand-orange bg-orange-50 px-2 py-0.2 rounded border border-orange-200">
                {inquiry.urgency} Priority
              </span>
            </div>

            <div>
              <span className="text-text-muted block text-[10px] uppercase font-bold">Contact Coordinates</span>
              <div className="mt-1 space-y-1">
                <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1 text-corporate-blue hover:underline">
                  <Mail className="w-3 h-3 text-text-muted" />
                  <span className="truncate">{inquiry.email}</span>
                </a>
                <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1 text-text-secondary hover:underline">
                  <Phone className="w-3 h-3 text-text-muted" />
                  <span>{inquiry.phone}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Inquiry Description & Requirements */}
          <div>
            <h4 className="font-bold text-sm text-text-primary mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-corporate-blue" />
              <span>Project Requirements &amp; Scope Overview</span>
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-border-gray text-text-secondary leading-relaxed font-sans text-xs">
              {inquiry.message}
            </div>
          </div>

          {/* Quick Lifecycle Status Updater */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-corporate-blue block">Update Lifecycle Stage</span>
              <span className="text-text-muted text-[11px]">Advance this inquiry through engineering evaluation</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {statusOptions.map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    onStatusChange(inquiry.id, st);
                    showToast(`Updated status to ${st}`);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    inquiry.status === st
                      ? 'bg-corporate-blue text-white shadow-xs'
                      : 'bg-white hover:bg-blue-100 text-corporate-blue border border-blue-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Internal Notes History */}
          <div>
            <h4 className="font-bold text-sm text-text-primary mb-3">Internal Engineering &amp; Operations Notes</h4>
            <div className="space-y-2 mb-4">
              {(!inquiry.notes || inquiry.notes.length === 0) ? (
                <p className="text-text-muted italic py-2">No internal notes logged yet for this dossier.</p>
              ) : (
                inquiry.notes.map((n, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-light-bg border border-border-gray/70 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-text-muted">
                      <span className="font-semibold text-corporate-blue">{n.author}</span>
                      <span>{n.date}</span>
                    </div>
                    <p className="text-text-primary">{n.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Log internal action item, site survey result, or meeting note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-corporate-blue hover:bg-navy-blue text-white rounded-xl font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Note</span>
              </button>
            </form>
          </div>

          {/* Client Email Generator */}
          <div className="pt-4 border-t border-border-gray">
            {!showReplyDraft ? (
              <button
                onClick={generateDefaultReply}
                className="inline-flex items-center gap-2 px-4 py-2 bg-light-bg hover:bg-gray-200/70 border border-border-gray text-corporate-blue font-semibold rounded-xl transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-brand-orange" />
                <span>Generate Official Formal Proposal Reply</span>
              </button>
            ) : (
              <div className="space-y-3 p-4 bg-orange-50/40 border border-orange-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-corporate-blue">Draft Official Communication</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(replyDraft);
                      showToast('Draft copied to clipboard!', 'success');
                    }}
                    className="text-[11px] font-semibold text-brand-orange hover:underline"
                  >
                    Copy to Clipboard
                  </button>
                </div>
                <textarea
                  rows={8}
                  value={replyDraft}
                  onChange={(e) => setReplyDraft(e.target.value)}
                  className="w-full p-3 bg-white border border-border-gray rounded-xl font-mono text-[11px] text-text-primary focus:outline-none focus:border-brand-orange"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetailModal;
