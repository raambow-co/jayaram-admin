import React from 'react';
import { Settings, Download, RotateCcw, Database, HardDrive, CheckCircle2 } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

const SettingsView = ({ inquiries, projects, onResetData, showToast }) => {
  // Export Database Backup as JSON
  const handleExportJSON = () => {
    const backupData = {
      exportTimestamp: new Date().toISOString(),
      version: '2.5',
      company: COMPANY_INFO.name,
      inquiries,
      projects,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `jayarams_bharat_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    showToast('Complete portal database exported as JSON backup.', 'success');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all inquiries and projects back to clean, verified data? Any unbacked items will be cleared.')) {
      onResetData();
      showToast('Database reset to clean authentic dataset.', 'info');
    }
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-border-gray shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-text-secondary text-[11px] font-bold mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>System &amp; Database Administration</span>
        </div>
        <h2 className="text-xl font-bold text-text-primary">
          Portal Settings &amp; Data Governance
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Configure administrative controls, backup local database state, and review division schema.
        </p>
      </div>

      {/* Grid: Admin Profile + Database Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Profile */}
        <div className="bg-white p-6 rounded-3xl border border-border-gray shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-gray">
            <h3 className="font-bold text-sm text-text-primary">Administrative Authority</h3>
            <span className="text-[10px] font-bold text-brand-orange bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
              Super Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-corporate-blue text-white flex items-center justify-center font-bold text-xl shadow-md">
              JB
            </div>
            <div>
              <h4 className="font-bold text-sm text-text-primary">Executive Operations Directorate</h4>
              <p className="text-xs text-text-secondary">{COMPANY_INFO.email}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Full Read &amp; Write Access
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-border-gray/50">
              <span className="text-text-muted">Entity:</span>
              <span className="font-semibold text-text-primary">{COMPANY_INFO.name}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border-gray/50">
              <span className="text-text-muted">Registered Office:</span>
              <span className="font-semibold text-text-primary">Financial District, Hyderabad</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-border-gray/50">
              <span className="text-text-muted">Contact Desk:</span>
              <span className="font-semibold text-text-primary">{COMPANY_INFO.phone}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-text-muted">Active Divisions:</span>
              <span className="font-semibold text-text-primary">5 Core Engineering Divisions</span>
            </div>
          </div>
        </div>

        {/* Database & Storage */}
        <div className="bg-white p-6 rounded-3xl border border-border-gray shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-gray">
            <h3 className="font-bold text-sm text-text-primary">Active Data Store &amp; Persistence</h3>
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Client LocalStorage Synced
            </span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Data persists safely in your browser storage. Backend API connection is currently decoupled as requested, allowing complete standalone operation.
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-light-bg border border-border-gray/70">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-corporate-blue" />
                <span>Division Inquiries Stored</span>
              </div>
              <span className="font-mono font-bold text-corporate-blue">{inquiries.length} records</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-light-bg border border-border-gray/70">
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4 text-brand-orange" />
                <span>Project Showcase Assets</span>
              </div>
              <span className="font-mono font-bold text-brand-orange">{projects.length} assets</span>
            </div>
          </div>

          {/* Backup & Reset Controls */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportJSON}
              className="flex-1 py-2.5 px-4 bg-corporate-blue hover:bg-navy-blue text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON Backup</span>
            </button>

            <button
              onClick={handleReset}
              className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Clean Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
