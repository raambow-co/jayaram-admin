import React from 'react';
import { BarChart3, TrendingUp, Leaf, SunMedium, Landmark, Network, Briefcase, Info, CheckCircle2 } from 'lucide-react';
import { DIVISIONS } from '../data/mockData';

const iconMap = {
  sustainability: Leaf,
  renewable: SunMedium,
  government: Landmark,
  network: Network,
  consultancy: Briefcase,
};

const AnalyticsView = ({ inquiries, projects }) => {
  const totalInquiries = inquiries.length;

  const divisionStats = DIVISIONS.map((div) => {
    const count = inquiries.filter(i => i.divisionId === div.id).length;
    const percentage = totalInquiries > 0 ? Math.round((count / totalInquiries) * 100) : 0;
    const projectCount = projects.filter(p => p.divisionId === div.id).length;
    return {
      ...div,
      count,
      percentage,
      projectCount
    };
  });

  const statusBreakdown = [
    { label: 'New / Intake', count: inquiries.filter(i => i.status === 'New').length, color: 'bg-brand-orange' },
    { label: 'Technical Review', count: inquiries.filter(i => i.status === 'In Review').length, color: 'bg-corporate-blue' },
    { label: 'Commercial Quote Sent', count: inquiries.filter(i => i.status === 'Contacted').length, color: 'bg-purple-600' },
    { label: 'Awarded / Approved', count: inquiries.filter(i => i.status === 'Approved').length, color: 'bg-emerald-600' },
    { label: 'Closed / Archived', count: inquiries.filter(i => i.status === 'Closed').length, color: 'bg-gray-400' },
  ];

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-border-gray shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-corporate-blue text-[11px] font-bold mb-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Strategic Pipeline Metrics</span>
        </div>
        <h2 className="text-xl font-bold text-text-primary">
          Division Analytics &amp; Pipeline Trajectory
        </h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Real-time dynamic analysis of inquiries, conversion efficiency, and project showcase distribution.
        </p>
      </div>

      {totalInquiries === 0 && (
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-corporate-blue shrink-0 mt-0.5" />
          <div className="text-xs text-text-primary">
            <span className="font-bold text-corporate-blue block mb-0.5">Pipeline Standby: 0 Active Inquiries</span>
            <p className="text-text-secondary leading-relaxed">
              The metrics engine is waiting for incoming stakeholder inquiries. As inquiries are logged manually or submitted via division desks, pipeline conversion rates, status funnels, and division distributions will compute in real time.
            </p>
          </div>
        </div>
      )}

      {/* Grid: Division Volume Share & Pipeline Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Division Share */}
        <div className="bg-white p-6 rounded-3xl border border-border-gray shadow-xs">
          <h3 className="font-bold text-sm text-text-primary mb-1">
            Inquiry Volume by 5 Core Divisions
          </h3>
          <p className="text-xs text-text-secondary mb-6">Percentage share of incoming stakeholder inquiries</p>

          <div className="space-y-4">
            {divisionStats.map((div) => {
              const Icon = iconMap[div.id] || BarChart3;
              return (
                <div key={div.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: div.themeColor }}></span>
                      <Icon className="w-3.5 h-3.5 text-text-muted" />
                      <span className="font-semibold text-text-primary">{div.shortName}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-corporate-blue">{div.count} inq</span>
                      <span className="text-text-muted text-[11px]">({div.percentage}%)</span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-light-bg rounded-full overflow-hidden border border-border-gray/50">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${div.percentage}%`, backgroundColor: div.themeColor }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pipeline Funnel */}
        <div className="bg-white p-6 rounded-3xl border border-border-gray shadow-xs">
          <h3 className="font-bold text-sm text-text-primary mb-1">
            Inquiry Pipeline &amp; Conversion Lifecycle
          </h3>
          <p className="text-xs text-text-secondary mb-6">Current operational stage of all inquiries</p>

          <div className="space-y-4">
            {statusBreakdown.map((stage) => {
              const pct = totalInquiries > 0 ? Math.round((stage.count / totalInquiries) * 100) : 0;
              return (
                <div key={stage.label} className="p-3 rounded-2xl bg-light-bg border border-border-gray/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <div>
                      <span className="font-semibold text-xs text-text-primary block">{stage.label}</span>
                      <span className="text-[10px] text-text-muted">Total records in state</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-base font-extrabold text-corporate-blue">{stage.count}</span>
                    <span className="text-xs text-text-muted block">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Engineering Portfolio Footprint */}
      <div className="bg-white p-6 rounded-3xl border border-border-gray shadow-xs">
        <h3 className="font-bold text-sm text-text-primary mb-1">
          Division Capabilities &amp; Engineering Readiness
        </h3>
        <p className="text-xs text-text-secondary mb-4">Core domain strengths under Jayarams Bharat Private Limited</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-light-bg border border-border-gray space-y-1.5">
            <div className="flex items-center gap-2 text-corporate-blue font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Turnkey Execution</span>
            </div>
            <p className="text-text-secondary text-[11px] leading-relaxed">
              End-to-end EPC execution from initial site survey to statutory commissioning across renewable energies, civil environmental works, and surveillance networks.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-light-bg border border-border-gray space-y-1.5">
            <div className="flex items-center gap-2 text-corporate-blue font-bold">
              <CheckCircle2 className="w-4 h-4 text-brand-orange" />
              <span>Institutional Compliance</span>
            </div>
            <p className="text-text-secondary text-[11px] leading-relaxed">
              Full alignment with GeM procurement standards, CPCB/SPCB ecological mandates, MNRE clean energy policies, and municipal guidelines.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-light-bg border border-border-gray space-y-1.5">
            <div className="flex items-center gap-2 text-corporate-blue font-bold">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Multi-Division Convergence</span>
            </div>
            <p className="text-text-secondary text-[11px] leading-relaxed">
              Unified cross-division synergies connecting solar EPC with EV corridors, smart surveillance networks, and strategic engineering DPR advisory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
