import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { PROJECTS, LEADERSHIP, GALLERY_IMAGES } from '../data';
import type { Project, LeadershipData, GalleryImage, LeadershipMember } from '../types';

interface DataContextType {
  projects: Project[];
  leadership: LeadershipData;
  gallery: GalleryImage[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: number) => void;
  addMember: (member: Omit<LeadershipMember, 'id'>, type: 'executive' | 'board') => void;
  updateMember: (member: LeadershipMember, type: 'executive' | 'board') => void;
  deleteMember: (id: number, type: 'executive' | 'board') => void;
  addImage: (image: Omit<GalleryImage, 'id'>) => void;
  deleteImage: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from LocalStorage or fallback to data.ts
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('leo_projects');
    return saved ? JSON.parse(saved) : PROJECTS;
  });

  const [leadership, setLeadership] = useState<LeadershipData>(() => {
    const saved = localStorage.getItem('leo_leadership');
    if (saved) return JSON.parse(saved);
    
    // Add IDs to initial data if missing (since data.ts might not have them for members)
    const execWithIds = LEADERSHIP.executive.map((m, i) => ({ ...m, id: i + 1, type: 'executive' as const }));
    const boardWithIds = LEADERSHIP.board.map((m, i) => ({ ...m, id: i + 100, type: 'board' as const }));
    return { executive: execWithIds, board: boardWithIds };
  });

  const [gallery, setGallery] = useState<GalleryImage[]>(() => {
    const saved = localStorage.getItem('leo_gallery');
    return saved ? JSON.parse(saved) : GALLERY_IMAGES;
  });

  // Sync with LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('leo_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('leo_leadership', JSON.stringify(leadership));
  }, [leadership]);

  useEffect(() => {
    localStorage.setItem('leo_gallery', JSON.stringify(gallery));
  }, [gallery]);

  // Project Actions
  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: Date.now() };
    setProjects([...projects, newProject]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  // Leadership Actions
  const addMember = (member: Omit<LeadershipMember, 'id'>, type: 'executive' | 'board') => {
    const newMember = { ...member, id: Date.now(), type };
    setLeadership(prev => ({
      ...prev,
      [type]: [...prev[type], newMember]
    }));
  };

  const updateMember = (updatedMember: LeadershipMember, type: 'executive' | 'board') => {
    setLeadership(prev => ({
      ...prev,
      [type]: prev[type].map(m => m.id === updatedMember.id ? updatedMember : m)
    }));
  };

  const deleteMember = (id: number, type: 'executive' | 'board') => {
    setLeadership(prev => ({
      ...prev,
      [type]: prev[type].filter(m => m.id !== id)
    }));
  };

  // Gallery Actions
  const addImage = (image: Omit<GalleryImage, 'id'>) => {
    const newImage = { ...image, id: Date.now() };
    setGallery([...gallery, newImage]);
  };

  const deleteImage = (id: number) => {
    setGallery(gallery.filter(img => img.id !== id));
  };

  return (
    <DataContext.Provider value={{
      projects,
      leadership,
      gallery,
      addProject,
      updateProject,
      deleteProject,
      addMember,
      updateMember,
      deleteMember,
      addImage,
      deleteImage
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
