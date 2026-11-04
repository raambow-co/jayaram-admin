/**
 * mockData.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Verified data models and authentic portfolio assets for Jayarams Bharat Admin Dashboard.
 * Accurately represents the 5 core engineering divisions of Jayarams Bharat Private Limited,
 * clean inquiries intake structure, and authentic engineering showcase assets.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const COMPANY_INFO = {
  name: 'Jayarams Bharat Private Limited',
  shortName: 'Jayarams Bharat',
  tagline: "Building India's Future Through Engineering Excellence",
  email: 'info@jayaramsbharat.com',
  phone: '+91 98765 43210',
  address: '123 Corporate Tower, Financial District, Hyderabad, India 500032',
  website: 'https://jayaramsbharat.com',
};

export const DIVISIONS = [
  {
    id: 'sustainability',
    name: 'Sustainability & Environmental Infrastructure',
    shortName: 'Sustainability & Infra',
    code: 'SEI',
    themeColor: '#059669', // Emerald
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    description: 'Eco-restoration, legacy waste bio-mining, effluent treatment plants (ETP/STP), and climate-resilient civil infrastructure.',
    image: '/sustainability-infra.jpg',
    leadName: 'Sustainability & Environmental Desk',
    targetIndustries: ['Municipal Corporations', 'State Pollution Control Boards', 'Industrial Parks', 'Urban Local Bodies'],
    contactEmail: 'info@jayaramsbharat.com',
  },
  {
    id: 'renewable',
    name: 'Renewable Energies',
    shortName: 'Renewable Energies',
    code: 'REN',
    themeColor: '#F26A21', // Brand Orange
    bgColor: '#FFF7ED',
    borderColor: '#FED7AA',
    description: 'Utility-scale & commercial Solar EPC, rooftop solar arrays, high-power DC EV charging plazas, and energy storage systems.',
    image: '/renewable-energies.jpg',
    leadName: 'Clean Energy & Solar EPC Desk',
    targetIndustries: ['Renewable Energy Agencies', 'National Highways', 'Industrial Discoms', 'Fleet Operators'],
    contactEmail: 'info@jayaramsbharat.com',
  },
  {
    id: 'government',
    name: 'Government Supplies',
    shortName: 'Govt Supplies & CSR',
    code: 'GVS',
    themeColor: '#0B2E73', // Corporate Blue
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    description: 'GeM verified institutional procurement, municipal heavy machinery, emergency disaster response gear, and civil works.',
    image: '/government-supplies.jpeg',
    leadName: 'Government Procurement & Tenders Desk',
    targetIndustries: ['Central Ministries', 'State PWDs', 'Public Sector Undertakings', 'Disaster Management Cells'],
    contactEmail: 'info@jayaramsbharat.com',
  },
  {
    id: 'network',
    name: 'Network Integration',
    shortName: 'Network Integration',
    code: 'NET',
    themeColor: '#4F46E5', // Indigo
    bgColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    description: 'City-wide ICCC surveillance hubs, optical fiber backbones, AI CCTV analytics, and intelligent traffic management.',
    image: '/network-integration.jpg',
    leadName: 'Network & Intelligent Systems Desk',
    targetIndustries: ['Smart City SPVs', 'Police Commissionerates', 'Metro Rail & Transit', 'Enterprise Facilities'],
    contactEmail: 'info@jayaramsbharat.com',
  },
  {
    id: 'consultancy',
    name: 'Consultancy Services',
    shortName: 'Consultancy Services',
    code: 'CON',
    themeColor: '#0891B2', // Cyan
    bgColor: '#ECFEFF',
    borderColor: '#A5F3FC',
    description: 'Detailed Project Reports (DPR), EIA statutory clearances, transaction advisory, techno-commercial feasibility, and project PMO.',
    image: '/solar-jairam.jpeg',
    leadName: 'Engineering Advisory & PMO Desk',
    targetIndustries: ['Infrastructure Investment Funds', 'State Planning Boards', 'Private Concessionaires', 'Urban Development Boards'],
    contactEmail: 'info@jayaramsbharat.com',
  }
];

// Clean initial inquiries dataset (starts fresh with zero fabricated/dummy submissions)
// Inquiries arrive in real-time as users submit them or as admins log manual entries.
export const INITIAL_INQUIRIES = [];

// Authentic project showcase portfolio representing the 5 core divisions of Jayarams Bharat
export const INITIAL_PROJECTS = [
  {
    id: 'PRJ-SEI-01',
    title: 'Sustainable Environmental Infrastructure Hub',
    divisionId: 'sustainability',
    imageUrl: '/sustainability-infra.jpg',
    location: 'Industrial & Municipal Zones, India',
    client: 'Jayarams Environmental Division',
    capacity: 'Closed-Loop Water Recycling & Bio-Recovery',
    status: 'Completed',
    featured: true,
    completionDate: '2025',
    description: 'Turnkey engineering for water stewardship, waste-to-resource recovery, ecological restorations, and climate-resilient green infrastructure.'
  },
  {
    id: 'PRJ-REN-01',
    title: 'Renewable Clean Energy & Solar EPC Solutions',
    divisionId: 'renewable',
    imageUrl: '/renewable-energies.jpg',
    location: 'National Highway & Commercial Corridors',
    client: 'Jayarams Clean Energy Solutions',
    capacity: 'High-Efficiency Solar PV EPC',
    status: 'Completed',
    featured: true,
    completionDate: '2025',
    description: 'High-efficiency Solar EPC solutions combined with tier-1 bifacial photovoltaic generation and clean power grid synchronization.'
  },
  {
    id: 'PRJ-REN-02',
    title: 'Commercial Solar Arrays & Fast EV Charging Plaza',
    divisionId: 'renewable',
    imageUrl: '/solar-jairam.jpeg',
    location: 'Commercial Transport & Industrial Parks',
    client: 'Jayarams Renewable Energies',
    capacity: 'High-Power DC Fast EV Charging Hub',
    status: 'In Execution',
    featured: true,
    completionDate: 'Q3 2026',
    description: 'Solar canopy-powered commercial EV charging plazas equipped with dual-gun fast chargers and smart load management.'
  },
  {
    id: 'PRJ-GVS-01',
    title: 'Institutional Government Supplies & Civil Equipment',
    divisionId: 'government',
    imageUrl: '/government-supplies.jpeg',
    location: 'Institutional & Public Sector Projects',
    client: 'Jayarams Government Procurement Desk',
    capacity: 'GeM Rate Contract & Rapid Response Gear',
    status: 'Completed',
    featured: true,
    completionDate: '2025',
    description: 'GeM verified institutional procurement, municipal heavy machinery, disaster rapid response equipment, and civil supplies.'
  },
  {
    id: 'PRJ-NET-01',
    title: 'Enterprise Network Backbone & Command Center',
    divisionId: 'network',
    imageUrl: '/network-integration.jpg',
    location: 'Metropolitan & Enterprise Facilities',
    client: 'Jayarams Network Integration',
    capacity: 'High-Speed Optical Fiber & ICCC Hub',
    status: 'Completed',
    featured: true,
    completionDate: '2025',
    description: 'Architecting secure digital backbones, AI-driven CCTV surveillance networks, command control centers, and telecom infrastructure.'
  },
  {
    id: 'PRJ-NET-02',
    title: 'Intelligent AI Video Surveillance & Security Grid',
    divisionId: 'network',
    imageUrl: '/cctv.jpeg',
    location: 'Smart Infrastructure & Transit Facilities',
    client: 'Jayarams Security Systems',
    capacity: 'Unified CCTV & Telemetry Network',
    status: 'In Execution',
    featured: false,
    completionDate: 'Q4 2026',
    description: 'High-definition automated number plate recognition, perimeter intrusion detection, and unified optical telemetry links.'
  }
];
