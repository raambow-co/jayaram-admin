import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Plus, Building2, MapPin } from 'lucide-react';
import { DIVISIONS } from '../data/mockData';
import { compressImage } from '../utils/imageCompressor';

const PRESET_ASSETS = [
  { label: 'Sustainability & Environmental Infrastructure', path: '/sustainability-infra.webp' },
  { label: 'Renewable Energies (Solar PV)', path: '/renewable-energies.webp' },
  { label: 'Solar Rooftop & Ground Hub', path: '/solar-jairam.webp' },
  { label: 'Network Integration (Command Center)', path: '/network-integration.webp' },
  { label: 'CCTV Surveillance & Optics', path: '/cctv.webp' },
  { label: 'Government Heavy Supplies & Machinery', path: '/government-supplies.webp' },
];

const NewProjectModal = ({ onClose, onAddProject, showToast }) => {
  const [formData, setFormData] = useState({
    title: '',
    divisionId: 'sustainability',
    imageUrl: '/sustainability-infra.webp',
    location: '',
    client: '',
    capacity: '',
    status: 'In Execution',
    completionDate: '2026',
    description: '',
  });

  const [previewError, setPreviewError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'imageUrl') {
      setPreviewError(false);
    }
  };

  const [isCompressing, setIsCompressing] = useState(false);

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
    if (!formData.title || !formData.client || !formData.location || !formData.capacity) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    const randomId = `PRJ-0${Math.floor(10 + Math.random() * 90)}`;
    const newProject = {
      id: randomId,
      ...formData,
      scale: formData.capacity,
      summary: formData.description,
      featured: false,
    };

    onAddProject(newProject);
    showToast(`Project "${formData.title}" added to showcase!`, 'success');
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
            <h3 className="font-bold text-base text-text-primary">Upload &amp; Showcase Project Image</h3>
            <p className="text-xs text-text-secondary">Add an executed infrastructure asset to the public portfolio</p>
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
              placeholder="e.g. 50MW Solar PV EPC Generating Substation"
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
                className="w-full px-3 py-2 bg-light-bg border border-border-gray rounded-xl font-medium focus:outline-none focus:border-corporate-blue"
              >
                <option value="In Execution">In Execution</option>
                <option value="Completed">Completed</option>
                <option value="Commissioning">Commissioning</option>
              </select>
            </div>
          </div>

          {/* Image Upload & Selection */}
          <div className="p-4 rounded-2xl bg-light-bg border border-border-gray space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-text-primary flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-brand-orange" />
                <span>Project Image Asset</span>
              </label>
              <span className="text-[10px] text-text-muted">High resolution JPG/PNG</span>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1">
              <span className="text-[10px] text-text-muted uppercase font-bold block">Select from Project Assets</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_ASSETS.map((asset) => (
                  <button
                    key={asset.path}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, imageUrl: asset.path }));
                      setPreviewError(false);
                    }}
                    className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                      formData.imageUrl === asset.path
                        ? 'bg-corporate-blue text-white font-bold border-corporate-blue'
                        : 'bg-white hover:bg-gray-100 text-text-secondary border-border-gray'
                    }`}
                  >
                    {asset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL or Upload File */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <span className="text-[10px] text-text-muted font-medium block mb-1">Image URL or Local Path:</span>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="/image-path.webp"
                  className="w-full px-3 py-1.5 bg-white border border-border-gray rounded-lg font-mono text-[11px] focus:outline-none focus:border-corporate-blue"
                />
              </div>

              <div>
                <span className="text-[10px] text-text-muted font-medium block mb-1">Or Upload Custom File:</span>
                <label className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 border border-border-gray rounded-lg cursor-pointer text-text-secondary font-medium transition-colors">
                  <Upload className={`w-3.5 h-3.5 ${isCompressing ? 'animate-bounce text-brand-orange' : ''}`} />
                  <span>{isCompressing ? 'Optimizing to WebP...' : 'Choose Image File...'}</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isCompressing} className="hidden" />
                </label>
              </div>
            </div>

            {/* Image Live Preview */}
            <div className="h-32 w-full rounded-xl overflow-hidden border border-border-gray bg-white relative flex items-center justify-center">
              {!previewError && formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Live Preview"
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
                  placeholder="e.g. NTPC / NHAI / GVMC"
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
                  placeholder="e.g. Visakhapatnam, Andhra Pradesh"
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
                placeholder="e.g. 50 MWp / 500 TPD / 1,200 Streams"
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
                placeholder="e.g. 2026 or Q2 2027"
                value={formData.completionDate}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-light-bg border border-border-gray rounded-xl focus:outline-none focus:border-corporate-blue"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">Project Summary</label>
            <textarea
              name="description"
              rows={2}
              placeholder="Highlight key engineering equipment, civil scope, and public impact..."
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
              className="px-5 py-2 text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publish to Showcase</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;
