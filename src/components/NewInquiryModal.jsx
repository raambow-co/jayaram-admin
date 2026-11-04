import React, { useState } from 'react';
import { X, Plus, Building2, User, Mail, Phone, MapPin } from 'lucide-react';
import { DIVISIONS } from '../data/mockData';

const NewInquiryModal = ({ onClose, onAddInquiry, defaultDivisionId, showToast }) => {
  const [formData, setFormData] = useState({
    divisionId: defaultDivisionId && defaultDivisionId !== 'all' ? defaultDivisionId : 'sustainability',
    fullName: '',
    organization: '',
    email: '',
    phone: '',
    location: '',
    projectScale: '',
    urgency: 'Medium',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.organization || !formData.subject || !formData.message) {
      showToast('Please fill in all mandatory fields.', 'error');
      return;
    }

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
    const randomId = `INQ-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newInquiry = {
      id: randomId,
      ...formData,
      status: 'New',
      submittedAt: formattedDate,
      notes: [
        {
          date: formattedDate,
          author: 'Admin Operations',
          text: 'Inquiry logged manually into administrative portal.'
        }
      ]
    };

    onAddInquiry(newInquiry);
    showToast(`Inquiry ${randomId} successfully logged!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-blue/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-border-gray w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border-gray bg-light-bg flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-text-primary">Log Manual Division Inquiry</h3>
            <p className="text-xs text-text-secondary">Record a direct client meeting, GeM notice, or tender inquiry</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Division Category Selector */}
          <div>
            <label className="block font-bold text-text-primary mb-1">
              Select Division Category <span className="text-red-500">*</span>
            </label>
            <select
              name="divisionId"
              value={formData.divisionId}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-light-bg border border-border-gray rounded-xl text-xs font-semibold focus:outline-none focus:border-corporate-blue"
            >
              {DIVISIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          {/* Client Name & Organization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-text-secondary mb-1">
                Stakeholder Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Er. Sudhir Reddy"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-text-secondary mb-1">
                Organization / Government Agency <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="organization"
                  placeholder="e.g. AP Transco / PWD"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue"
                />
              </div>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-text-secondary mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  placeholder="contact@organization.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-text-secondary mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue font-mono"
                />
              </div>
            </div>
          </div>

          {/* Location & Scale */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-text-secondary mb-1">Project Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Vijayawada, AP"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-text-secondary mb-1">Estimated Scale</label>
              <input
                type="text"
                name="projectScale"
                placeholder="e.g. ₹12.5 Cr"
                value={formData.projectScale}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block font-medium text-text-secondary mb-1">Urgency</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue font-medium"
              >
                <option value="High">High Urgency</option>
                <option value="Medium">Medium</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block font-bold text-text-primary mb-1">
              Inquiry Subject / Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              placeholder="e.g. Tender for 15MW Grid Connected Rooftop Solar Array"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue font-medium"
            />
          </div>

          {/* Message / Scope */}
          <div>
            <label className="block font-bold text-text-primary mb-1">
              Detailed Scope &amp; Specifications <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              rows={4}
              placeholder="Enter technical specifications, tender deadlines, equipment details, and initial notes..."
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-3 bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-border-gray flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Log Into System</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewInquiryModal;
