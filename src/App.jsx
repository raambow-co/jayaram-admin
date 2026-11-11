import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import EnquiriesManager from './components/EnquiriesManager';
import ProjectsManager from './components/ProjectsManager';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import InquiryDetailModal from './components/InquiryDetailModal';
import NewInquiryModal from './components/NewInquiryModal';
import NewProjectModal from './components/NewProjectModal';
import Toast from './components/Toast';
import { INITIAL_INQUIRIES, INITIAL_PROJECTS } from './data/mockData';
import { isFirebaseConfigured } from './firebase';
import { 
  subscribeToInquiries, 
  updateInquiryStatusInDb, 
  addInquiryNoteInDb, 
  createInquiryInDb, 
  subscribeToProjects, 
  createProjectInDb, 
  updateProjectInDb,
  deleteProjectInDb,
  seedInitialProjectsInDb
} from './services/adminService';

const App = () => {
  // Load data from localStorage or fallback to initial authentic data
  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('jayarams_admin_inquiries');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically purge old mock dummy data if it contains the fake Bhattacharya/Solanki items
        const hasLegacyDummy = Array.isArray(parsed) && parsed.some(
          i => i.id === 'INQ-2026-101' || i.fullName === 'Shri R. K. Bhattacharya' || i.fullName === 'Vikramaditya Solanki'
        );
        if (hasLegacyDummy) {
          localStorage.removeItem('jayarams_admin_inquiries');
          return INITIAL_INQUIRIES;
        }
        return parsed;
      }
      return INITIAL_INQUIRIES;
    } catch {
      return INITIAL_INQUIRIES;
    }
  });

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('jayarams_admin_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically purge old mock dummy projects if they contain the fake Kapuluppada PRJ-001
        const hasLegacyDummy = Array.isArray(parsed) && parsed.some(
          p => p.id === 'PRJ-001' || p.title?.includes('Kapuluppada')
        );
        if (hasLegacyDummy) {
          localStorage.removeItem('jayarams_admin_projects');
          return INITIAL_PROJECTS;
        }
        // Seamlessly migrate legacy .jpg/.jpeg paths to .webp
        return Array.isArray(parsed) ? parsed.map(p => ({
          ...p,
          imageUrl: typeof p.imageUrl === 'string'
            ? p.imageUrl.replace(/\.(jpg|jpeg)$/i, '.webp')
            : '/sustainability-infra.webp'
        })) : INITIAL_PROJECTS;
      }
      return INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jayarams_admin_inquiries', JSON.stringify(inquiries));
    } catch (e) {
      console.error('Failed to save inquiries to localStorage', e);
    }
  }, [inquiries]);

  useEffect(() => {
    try {
      localStorage.setItem('jayarams_admin_projects', JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage', e);
    }
  }, [projects]);

  // Real-time Firestore sync
  useEffect(() => {
    const unsubInquiries = subscribeToInquiries((items) => {
      if (items && Array.isArray(items)) {
        setInquiries(items);
      }
    }, inquiries);

    const unsubProjects = subscribeToProjects((items) => {
      if (items && Array.isArray(items) && items.length > 0) {
        setProjects(items);
      }
    }, projects);

    return () => {
      unsubInquiries();
      unsubProjects();
    };
  }, []);

  // Navigation states
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'enquiries' | 'projects' | 'analytics' | 'settings'

  // Google Analytics 4 page view tracking for SPA transitions
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      const viewTitleMap = {
        dashboard: 'Dashboard Overview',
        enquiries: 'Division Enquiries & Tenders',
        projects: 'Project Showcase Assets',
        analytics: 'Analytics & Pipeline Performance',
        settings: 'Settings & Data Governance'
      };
      const title = viewTitleMap[currentView] || 'Executive Command';
      window.gtag('event', 'page_view', {
        page_title: `Jayarams Bharat — ${title}`,
        page_location: window.location.href,
        page_path: `/${currentView}`
      });
    }
  }, [currentView]);
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'sustainability' | etc.
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Popups
  const [activeInquiryModal, setActiveInquiryModal] = useState(null);
  const [showNewInquiryModal, setShowNewInquiryModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Status Change Handler
  const handleStatusChange = (inquiryId, newStatus) => {
    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return { ...inq, status: newStatus };
      }
      return inq;
    }));

    if (activeInquiryModal && activeInquiryModal.id === inquiryId) {
      setActiveInquiryModal(prev => ({ ...prev, status: newStatus }));
    }

    updateInquiryStatusInDb(inquiryId, newStatus);
  };

  // Add Internal Note Handler
  const handleAddNote = (inquiryId, noteText) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;
    const newNoteObj = {
      date: formattedDate,
      author: 'Operations Directorate',
      text: noteText,
    };

    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          notes: [...(inq.notes || []), newNoteObj],
        };
      }
      return inq;
    }));

    if (activeInquiryModal && activeInquiryModal.id === inquiryId) {
      setActiveInquiryModal(prev => ({
        ...prev,
        notes: [...(prev.notes || []), newNoteObj],
      }));
    }

    addInquiryNoteInDb(inquiryId, newNoteObj);
  };

  // Add Manual Inquiry
  const handleAddInquiry = async (newInquiry) => {
    setInquiries(prev => [newInquiry, ...prev]);
    try {
      await createInquiryInDb(newInquiry);
    } catch (err) {
      console.warn('Inquiry saved locally:', err);
    }
  };

  // Add New Project Showcase
  const handleAddProject = async (newProject) => {
    setProjects(prev => [newProject, ...prev]);
    try {
      await createProjectInDb(newProject);
    } catch (err) {
      console.warn('Project saved locally:', err);
    }
  };

  // Update Existing Project
  const handleUpdateProject = async (projectId, updatedData) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, ...updatedData };
      }
      return p;
    }));
    try {
      await updateProjectInDb(projectId, updatedData);
    } catch (err) {
      console.warn('Project updated locally:', err);
    }
  };

  // Delete Project Showcase
  const handleDeleteProject = async (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    try {
      await deleteProjectInDb(projectId);
    } catch (err) {
      console.warn('Project deleted locally:', err);
    }
  };

  // Reset to Clean Authentic Seed Data
  const handleResetData = () => {
    setInquiries(INITIAL_INQUIRIES);
    setProjects(INITIAL_PROJECTS);
    localStorage.removeItem('jayarams_admin_inquiries');
    localStorage.removeItem('jayarams_admin_projects');
  };

  // Seed Initial Projects to Firestore
  const handleSeedFirestoreProjects = async () => {
    try {
      await seedInitialProjectsInDb(INITIAL_PROJECTS);
      showToast('Initial authentic projects successfully synced to Firestore!', 'success');
    } catch (err) {
      console.error('Failed to seed projects to Firestore:', err);
      showToast('Failed to seed projects to Firestore', 'error');
    }
  };

  // Jump directly to a Category from Dashboard
  const handleSelectCategoryFromDashboard = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentView('enquiries');
  };

  return (
    <div className="min-h-screen flex bg-light-bg text-text-primary antialiased font-poppins">
      {/* Fixed Left Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        inquiries={inquiries}
        projects={projects}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          inquiries={inquiries}
          onSelectInquiry={(inq) => setActiveInquiryModal(inq)}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <DashboardOverview
              inquiries={inquiries}
              projects={projects}
              onSelectCategory={handleSelectCategoryFromDashboard}
              onSelectInquiry={(inq) => setActiveInquiryModal(inq)}
              onNewInquiry={() => setShowNewInquiryModal(true)}
              onNewProject={() => setShowNewProjectModal(true)}
              onViewProjects={() => setCurrentView('projects')}
            />
          )}

          {currentView === 'enquiries' && (
            <EnquiriesManager
              inquiries={inquiries}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectInquiry={(inq) => setActiveInquiryModal(inq)}
              onStatusChange={handleStatusChange}
              onNewInquiry={() => setShowNewInquiryModal(true)}
              showToast={showToast}
            />
          )}

          {currentView === 'projects' && (
            <ProjectsManager
              projects={projects}
              onNewProject={() => setShowNewProjectModal(true)}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              showToast={showToast}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView
              inquiries={inquiries}
              projects={projects}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              inquiries={inquiries}
              projects={projects}
              onResetData={handleResetData}
              onSeedFirestore={handleSeedFirestoreProjects}
              isFirebaseConfigured={isFirebaseConfigured}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Inquiry Detail Dossier Modal */}
      {activeInquiryModal && (
        <InquiryDetailModal
          inquiry={activeInquiryModal}
          onClose={() => setActiveInquiryModal(null)}
          onStatusChange={handleStatusChange}
          onAddNote={handleAddNote}
          showToast={showToast}
        />
      )}

      {/* New Manual Inquiry Modal */}
      {showNewInquiryModal && (
        <NewInquiryModal
          onClose={() => setShowNewInquiryModal(false)}
          onAddInquiry={handleAddInquiry}
          defaultDivisionId={selectedCategory}
          showToast={showToast}
        />
      )}

      {/* New Project Showcase Modal */}
      {showNewProjectModal && (
        <NewProjectModal
          onClose={() => setShowNewProjectModal(false)}
          onAddProject={handleAddProject}
          showToast={showToast}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default App;
