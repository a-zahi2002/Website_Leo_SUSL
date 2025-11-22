import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Users, FolderOpen, Image, X, Save } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { Project, LeadershipMember, GalleryImage } from '../types';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { 
    projects, leadership, gallery, 
    addProject, updateProject, deleteProject,
    addMember, updateMember, deleteMember,
    addImage, deleteImage
  } = useData();

  const [activeTab, setActiveTab] = useState<'projects' | 'leadership' | 'gallery'>('projects');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form States
  const [projectForm, setProjectForm] = useState<Partial<Project>>({ category: 'Upcoming', status: 'Active' });
  const [memberForm, setMemberForm] = useState<Partial<LeadershipMember>>({ type: 'executive' });
  const [imageForm, setImageForm] = useState<Partial<GalleryImage>>({});

  const handleAddClick = () => {
    setEditingItem(null);
    setProjectForm({ category: 'Upcoming', status: 'Active' });
    setMemberForm({ type: 'executive' });
    setImageForm({});
    setIsModalOpen(true);
  };

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'projects') setProjectForm(item);
    if (activeTab === 'leadership') setMemberForm(item);
    if (activeTab === 'gallery') setImageForm(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number, type?: 'executive' | 'board') => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (activeTab === 'projects') deleteProject(id);
      if (activeTab === 'leadership' && type) deleteMember(id, type);
      if (activeTab === 'gallery') deleteImage(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'projects') {
      if (editingItem) updateProject(projectForm as Project);
      else addProject(projectForm as Omit<Project, 'id'>);
    } else if (activeTab === 'leadership') {
      if (editingItem) updateMember(memberForm as LeadershipMember, memberForm.type as 'executive' | 'board');
      else addMember(memberForm as Omit<LeadershipMember, 'id'>, memberForm.type as 'executive' | 'board');
    } else if (activeTab === 'gallery') {
      if (editingItem) { /* Gallery update not really needed, usually just add/delete */ }
      else addImage(imageForm as Omit<GalleryImage, 'id'>);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => navigate('/')} 
              className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 dark:text-gray-300"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 dark:text-gray-300 hidden md:inline">Welcome, Admin</span>
            <div className="w-10 h-10 bg-[var(--color-leo-maroon)] rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div onClick={() => setActiveTab('projects')} className={`cursor-pointer p-6 rounded-xl shadow-sm border transition-all ${activeTab === 'projects' ? 'bg-white dark:bg-slate-800 border-[var(--color-leo-gold)] ring-2 ring-[var(--color-leo-gold)]/20' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:shadow-md'}`}>
            <div className="flex items-center">
              <div className="bg-blue-500 p-4 rounded-lg text-white mr-4">
                <FolderOpen size={24} />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Projects</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{projects.length}</p>
              </div>
            </div>
          </div>
          <div onClick={() => setActiveTab('leadership')} className={`cursor-pointer p-6 rounded-xl shadow-sm border transition-all ${activeTab === 'leadership' ? 'bg-white dark:bg-slate-800 border-[var(--color-leo-gold)] ring-2 ring-[var(--color-leo-gold)]/20' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:shadow-md'}`}>
            <div className="flex items-center">
              <div className="bg-green-500 p-4 rounded-lg text-white mr-4">
                <Users size={24} />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Members</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{leadership.executive.length + leadership.board.length}</p>
              </div>
            </div>
          </div>
          <div onClick={() => setActiveTab('gallery')} className={`cursor-pointer p-6 rounded-xl shadow-sm border transition-all ${activeTab === 'gallery' ? 'bg-white dark:bg-slate-800 border-[var(--color-leo-gold)] ring-2 ring-[var(--color-leo-gold)]/20' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:shadow-md'}`}>
            <div className="flex items-center">
              <div className="bg-purple-500 p-4 rounded-lg text-white mr-4">
                <Image size={24} />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Gallery Images</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{gallery.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Management Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white capitalize">{activeTab} Management</h2>
            <button 
              onClick={handleAddClick}
              className="bg-[var(--color-leo-maroon)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-900 transition-colors text-sm font-medium"
            >
              <Plus size={16} /> Add New
            </button>
          </div>
          
          <div className="overflow-x-auto">
            {activeTab === 'projects' && (
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Project Name</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 text-gray-800 dark:text-gray-200 font-medium">{project.title}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{project.category}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          project.category === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          project.category === 'Ongoing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {project.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEditClick(project)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDeleteClick(project.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'leadership' && (
              <div className="p-6">
                <h3 className="font-bold text-gray-500 mb-4 uppercase text-sm">Executive Committee</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {leadership.executive.map((member) => (
                    <div key={member.id} className="flex items-center p-4 border border-gray-100 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                      <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                      <div className="flex-grow">
                        <p className="font-bold text-gray-800 dark:text-white">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.position}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleEditClick(member)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteClick(member.id, 'executive')} className="p-1.5 text-red-600 hover:bg-red-100 rounded"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="font-bold text-gray-500 mb-4 uppercase text-sm">Board of Directors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {leadership.board.map((member) => (
                    <div key={member.id} className="flex items-center p-4 border border-gray-100 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                      <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                      <div className="flex-grow">
                        <p className="font-bold text-gray-800 dark:text-white">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.position}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleEditClick(member)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteClick(member.id, 'board')} className="p-1.5 text-red-600 hover:bg-red-100 rounded"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.map((img) => (
                  <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-square">
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => handleDeleteClick(img.id)} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.alt}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {activeTab === 'projects' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      value={projectForm.title || ''}
                      onChange={e => setProjectForm({...projectForm, title: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                      <select 
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        value={projectForm.category}
                        onChange={e => setProjectForm({...projectForm, category: e.target.value as any})}
                      >
                        <option value="Completed">Completed</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Upcoming">Upcoming</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Date/Status</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        value={projectForm.date || projectForm.status || ''}
                        onChange={e => setProjectForm({...projectForm, date: e.target.value, status: e.target.value})}
                        placeholder="e.g. Oct 2023"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea 
                      required
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      value={projectForm.description || ''}
                      onChange={e => setProjectForm({...projectForm, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                    <input 
                      type="url" 
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      value={projectForm.image || ''}
                      onChange={e => setProjectForm({...projectForm, image: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}

              {activeTab === 'leadership' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      value={memberForm.name || ''}
                      onChange={e => setMemberForm({...memberForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Position</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      value={memberForm.position || ''}
                      onChange={e => setMemberForm({...memberForm, position: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Type</label>
                    <select 
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      value={memberForm.type}
                      onChange={e => setMemberForm({...memberForm, type: e.target.value as any})}
                    >
                      <option value="executive">Executive Committee</option>
                      <option value="board">Board of Directors</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                    <input 
                      type="url" 
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      value={memberForm.image || ''}
                      onChange={e => setMemberForm({...memberForm, image: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}

              {activeTab === 'gallery' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Caption / Alt Text</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      value={imageForm.alt || ''}
                      onChange={e => setImageForm({...imageForm, alt: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                    <input 
                      type="url" 
                      required
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      value={imageForm.src || ''}
                      onChange={e => setImageForm({...imageForm, src: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[var(--color-leo-maroon)] text-white font-bold hover:bg-red-900 transition-colors flex items-center gap-2"
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
