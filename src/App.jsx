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
        return parsed;
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

  // Navigation states
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'enquiries' | 'projects' | 'analytics' | 'settings'
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
  };

  // Add Manual Inquiry
  const handleAddInquiry = (newInquiry) => {
    setInquiries(prev => [newInquiry, ...prev]);
  };

  // Add New Project Showcase
  const handleAddProject = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
  };

  // Delete Project Showcase
  const handleDeleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  // Reset to Clean Authentic Seed Data
  const handleResetData = () => {
    setInquiries(INITIAL_INQUIRIES);
    setProjects(INITIAL_PROJECTS);
    localStorage.removeItem('jayarams_admin_inquiries');
    localStorage.removeItem('jayarams_admin_projects');
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
