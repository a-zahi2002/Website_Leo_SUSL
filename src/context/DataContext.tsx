import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { GALLERY_IMAGES } from '../data';
import type { Project, LeadershipData, GalleryImage, LeadershipMember } from '../types';
import { projectsAPI, leadershipAPI } from '../lib/supabaseService';

interface DataContextType {
  projects: Project[];
  leadership: LeadershipData;
  gallery: GalleryImage[];
  loading: boolean;
  error: string | null;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  addMember: (member: Omit<LeadershipMember, 'id'>, type: 'executive' | 'board') => Promise<void>;
  updateMember: (member: LeadershipMember, type: 'executive' | 'board') => Promise<void>;
  deleteMember: (id: number, type: 'executive' | 'board') => Promise<void>;
  addImage: (image: Omit<GalleryImage, 'id'>) => void;
  deleteImage: (id: number) => void;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [leadership, setLeadership] = useState<LeadershipData>({ executive: [], board: [] });
  const [gallery, setGallery] = useState<GalleryImage[]>(() => {
    // Gallery still uses localStorage for now
    const saved = localStorage.getItem('leo_gallery');
    return saved ? JSON.parse(saved) : GALLERY_IMAGES;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Supabase on mount
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectsData, leadershipData] = await Promise.all([
        projectsAPI.getAll(),
        leadershipAPI.getAll(),
      ]);

      setProjects(projectsData);
      setLeadership(leadershipData);
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
      setError('Failed to load data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync gallery with LocalStorage (Gallery still uses localStorage)
  useEffect(() => {
    localStorage.setItem('leo_gallery', JSON.stringify(gallery));
  }, [gallery]);

  // Project Actions
  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      const newProject = await projectsAPI.create(project);
      setProjects(prev => [newProject, ...prev]);
    } catch (err) {
      console.error('Error adding project:', err);
      throw err;
    }
  };

  const updateProject = async (updatedProject: Project) => {
    try {
      const updated = await projectsAPI.update(updatedProject.id, updatedProject);
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await projectsAPI.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  // Leadership Actions
  const addMember = async (member: Omit<LeadershipMember, 'id'>, type: 'executive' | 'board') => {
    try {
      const roleType = type === 'executive' ? 'Executive' : 'Board';
      const newMember = await leadershipAPI.create(member, roleType);
      
      setLeadership(prev => ({
        ...prev,
        [type]: [...prev[type], newMember]
      }));
    } catch (err) {
      console.error('Error adding member:', err);
      throw err;
    }
  };

  const updateMember = async (updatedMember: LeadershipMember, type: 'executive' | 'board') => {
    try {
      const roleType = type === 'executive' ? 'Executive' : 'Board';
      const updated = await leadershipAPI.update(updatedMember.id, updatedMember, roleType);
      
      setLeadership(prev => ({
        ...prev,
        [type]: prev[type].map(m => m.id === updated.id ? updated : m)
      }));
    } catch (err) {
      console.error('Error updating member:', err);
      throw err;
    }
  };

  const deleteMember = async (id: number, type: 'executive' | 'board') => {
    try {
      await leadershipAPI.delete(id);
      
      setLeadership(prev => ({
        ...prev,
        [type]: prev[type].filter(m => m.id !== id)
      }));
    } catch (err) {
      console.error('Error deleting member:', err);
      throw err;
    }
  };

  // Gallery Actions (still using localStorage)
  const addImage = (image: Omit<GalleryImage, 'id'>) => {
    const newImage = { ...image, id: Date.now() };
    setGallery([...gallery, newImage]);
  };

  const deleteImage = (id: number) => {
    setGallery(gallery.filter(img => img.id !== id));
  };

  // Refresh all data
  const refreshData = async () => {
    await fetchData();
  };

  return (
    <DataContext.Provider value={{
      projects,
      leadership,
      gallery,
      loading,
      error,
      addProject,
      updateProject,
      deleteProject,
      addMember,
      updateMember,
      deleteMember,
      addImage,
      deleteImage,
      refreshData
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
