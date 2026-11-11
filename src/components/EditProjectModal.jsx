import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Save, Building2, MapPin } from 'lucide-react';
import { DIVISIONS } from '../data/mockData';
import { compressImage } from '../utils/imageCompressor';

const PRESET_ASSETS = [
  { label: 'Sustainability & Environmental Infrastructure', path: '/sustainability-infra.webp' },
  { label: 'Renewable Energies (Utility Solar)', path: '/renewable-energies.webp' },
  { label: 'Solar Rooftop & Ground Hub', path: '/solar-jairam.webp' },
  { label: 'Network Integration (Command Center)', path: '/network-integration.webp' },
  { label: 'CCTV Surveillance & Optics', path: '/cctv.webp' },
  { label: 'Government Heavy Supplies & Machinery', path: '/government-supplies.webp' },
];

const EditProjectModal = ({ project, onClose, onUpdateProject, showToast }) => {
  const [formData, setFormData] = useState({
    title: project.title || '',
    divisionId: project.divisionId || 'sustainability',
    imageUrl: project.imageUrl || '/sustainability-infra.webp',
    location: project.location || '',
    client: project.client || '',
    capacity: project.capacity || project.scale || '',
    status: project.status || 'Delivered',
    completionDate: project.completionDate || '2026',
    description: project.description || project.summary || '',
  });

  const [isCompressing, setIsCompressing] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'imageUrl') {
      setPreviewError(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsCompressing(true);
        const compressed = await compressImage(file, 1400, 0.84);
        setFormData(prev => ({ ...prev, imageUrl: compressed }));
        setPreviewError(false);
        showToast('Image uploaded and optimized successfully!', 'success');
      } catch (err) {
        showToast('Failed to optimize image: ' + err.message, 'error');
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.client || !formData.location) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    // Mirror scale and summary for backward compatibility across views
    const updatedProject = {
      ...formData,
      scale: formData.capacity,
      summary: formData.description,
    };

    onUpdateProject(project.id, updatedProject);
    showToast(`Updated "${formData.title}" successfully! Live on website.`, 'success');
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-corporate-blue text-[10px] font-mono font-bold mb-1">
              <span>{project.id}</span>
            </div>
            <h3 className="font-bold text-base text-text-primary">Edit Project &amp; Change Image</h3>
            <p className="text-xs text-text-secondary">Updates are synchronized to Firebase Firestore in real-time</p>
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
          {/* Project Title */}
          <div>
            <label className="block font-bold text-text-primary mb-1">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue font-medium"
            />
          </div>

          {/* Division Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-text-primary mb-1">
                Division Category <span className="text-red-500">*</span>
              </label>
              <select
                name="divisionId"
                value={formData.divisionId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-light-bg border border-border-gray rounded-xl font-semibold focus:outline-none focus:border-corporate-blue"
              >
                {DIVISIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-text-primary mb-1">Execution Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-light-bg border border-border-gray rounded-xl font-semibold focus:outline-none focus:border-corporate-blue"
              >
                <option value="Delivered">Delivered &amp; Commissioned</option>
                <option value="In Execution">In Active Execution</option>
                <option value="Planned">Planned / Tender Awarded</option>
              </select>
            </div>
          </div>

          {/* Image Management Section */}
          <div className="p-4 bg-light-bg rounded-2xl border border-border-gray space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-text-primary">
                Project Showcase Image <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-text-secondary">Upload file, select preset, or enter URL</span>
            </div>

            {/* Upload from Device */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="w-full sm:w-auto flex-1 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="px-4 py-2 bg-white border border-dashed border-border-gray hover:border-corporate-blue rounded-xl flex items-center justify-center gap-2 text-text-secondary hover:text-corporate-blue transition-colors">
                  <Upload className="w-4 h-4 text-brand-orange" />
                  <span className="font-semibold">
                    {isCompressing ? 'Optimizing image...' : 'Upload New Photo from Device'}
                  </span>
                </div>
              </label>
            </div>

            {/* Preset Selector */}
            <div>
              <span className="text-[10px] text-text-secondary block mb-1 font-semibold">Or choose from authentic presets:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {PRESET_ASSETS.map((preset) => (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, imageUrl: preset.path }));
                      setPreviewError(false);
                    }}
                    className={`p-1.5 text-[10px] font-medium text-left rounded-lg border transition-all truncate flex items-center gap-1.5 ${
                      formData.imageUrl === preset.path
                        ? 'bg-corporate-blue text-white border-corporate-blue'
                        : 'bg-white border-border-gray text-text-secondary hover:border-corporate-blue'
                    }`}
                  >
                    <img src={preset.path} alt="" className="w-4 h-4 rounded object-cover shrink-0" />
                    <span className="truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL Input */}
            <div>
              <span className="text-[10px] text-text-secondary block mb-1">Direct Image URL:</span>
              <input
                type="text"
                name="imageUrl"
                placeholder="https://... or /image-path.webp"
                value={formData.imageUrl}
                onChange={handleChange}
                required
                className="w-full px-3 py-1.5 bg-white border border-border-gray rounded-xl font-mono text-[11px] focus:outline-none focus:border-corporate-blue"
              />
            </div>

            {/* Image Preview Box */}
            <div className="relative h-44 w-full bg-slate-900 rounded-xl overflow-hidden border border-border-gray flex items-center justify-center">
              {!previewError && formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  onError={() => setPreviewError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-text-muted text-[11px]">
                  <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                  Image Preview Unavailable
                </div>
              )}
            </div>
          </div>

          {/* Client & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-text-secondary mb-1">
                Client / Nodal Authority <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-text-secondary mb-1">
                Site Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue"
                />
              </div>
            </div>
          </div>

          {/* Capacity Metric & Completion Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-text-primary mb-1">
                Capacity / Specification Metric <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue font-mono font-bold text-corporate-blue"
              />
            </div>

            <div>
              <label className="block font-medium text-text-secondary mb-1">Completion Year / Quarter</label>
              <input
                type="text"
                name="completionDate"
                value={formData.completionDate}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">Project Summary / Details</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue"
            />
          </div>

          {/* Footer Action */}
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
              className="px-5 py-2 text-xs font-semibold text-white bg-corporate-blue hover:bg-navy-blue rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;

