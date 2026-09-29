import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import api from '../../api/axios';
import DynamicIcon from '../../components/DynamicIcon';
import { Cpu, Plus, Edit2, Trash2, Save, X, CheckCircle2, AlertCircle, Loader2, ChevronUp, ChevronDown, FolderPlus } from 'lucide-react';

const SkillsManager = () => {
  const { portfolio, refreshPortfolio } = usePortfolio();
  const categories = portfolio?.categories || [];

  const [categoryModal, setCategoryModal] = useState({ open: false, mode: 'create', data: null });
  const [skillModal, setSkillModal] = useState({ open: false, mode: 'create', data: null });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReorderSkill = async (skill, direction) => {
    const currentOrder = skill.order || 0;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    try {
      await api.put(`/admin/skills/${skill.id}`, {
        name: skill.name,
        categoryId: skill.categoryId,
        proficiency: skill.proficiency,
        icon: skill.icon,
        order: newOrder,
      });
      await refreshPortfolio();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReorderCategory = async (cat, direction) => {
    const currentOrder = cat.order || 0;
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    try {
      await api.put(`/admin/categories/${cat.id}`, {
        name: cat.name,
        order: newOrder,
      });
      await refreshPortfolio();
    } catch (err) {
      console.error(err);
    }
  };

  // Forms state
  const [categoryForm, setCategoryForm] = useState({ name: '', order: 0 });
  const [skillForm, setSkillForm] = useState({
    name: '',
    categoryId: '',
    proficiency: 85,
    icon: 'Code',
    order: 0,
  });

  // Category CRUD Handlers
  const handleOpenCategory = (mode, cat = null) => {
    setCategoryModal({ open: true, mode, data: cat });
    if (mode === 'edit' && cat) {
      setCategoryForm({ name: cat.name, order: cat.order || 0 });
    } else {
      setCategoryForm({ name: '', order: categories.length + 1 });
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (categoryModal.mode === 'create') {
        await api.post('/admin/categories', categoryForm);
      } else {
        await api.put(`/admin/categories/${categoryModal.data.id}`, categoryForm);
      }
      await refreshPortfolio();
      setCategoryModal({ open: false, mode: 'create', data: null });
      setStatus({ type: 'success', message: 'Category saved!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to save category.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete category and all skills inside it?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      await refreshPortfolio();
      setStatus({ type: 'success', message: 'Category deleted!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to delete category.' });
    }
  };

  // Skill CRUD Handlers
  const handleOpenSkill = (mode, skill = null, catId = '') => {
    setSkillModal({ open: true, mode, data: skill });
    if (mode === 'edit' && skill) {
      setSkillForm({
        name: skill.name,
        categoryId: skill.categoryId,
        proficiency: skill.proficiency || 85,
        icon: skill.icon || 'Code',
        order: skill.order || 0,
      });
    } else {
      setSkillForm({
        name: '',
        categoryId: catId || (categories[0]?.id || ''),
        proficiency: 85,
        icon: 'Code',
        order: 0,
      });
    }
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (skillModal.mode === 'create') {
        await api.post('/admin/skills', skillForm);
      } else {
        await api.put(`/admin/skills/${skillModal.data.id}`, skillForm);
      }
      await refreshPortfolio();
      setSkillModal({ open: false, mode: 'create', data: null });
      setStatus({ type: 'success', message: 'Skill saved!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to save skill.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete skill entry?')) return;
    try {
      await api.delete(`/admin/skills/${id}`);
      await refreshPortfolio();
      setStatus({ type: 'success', message: 'Skill entry deleted!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to delete skill.' });
    }
  };

  const availableIcons = [
    'Brain', 'Cpu', 'Bot', 'Sparkles', 'Eye', 'Code', 'FileCode', 'Terminal',
    'Database', 'Server', 'Zap', 'Layers', 'HardDrive', 'Layout', 'Palette',
    'Box', 'Cloud', 'GitBranch', 'Globe', 'Shield'
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyan-400" /> Skills Manager
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage your technical skills, categories, and icons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenCategory('create')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-800 flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-cyan-400" /> Add Category
          </button>
          <button
            onClick={() => handleOpenSkill('create')}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </button>
        </div>
      </div>

      {status && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center gap-3 border ${
            status.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{status.message}</span>
        </div>
      )}

      {/* Categories & Skills Display */}
      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            
            {/* Category Title & Actions */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100">{cat.name}</h3>
                <span className="text-xs text-slate-500 font-mono">({cat.skills?.length || 0} skills)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleReorderCategory(cat, 'up')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                  title="Move Category Up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleReorderCategory(cat, 'down')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                  title="Move Category Down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenSkill('create', null, cat.id)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-semibold flex items-center gap-1 border border-slate-800"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Skill
                </button>
                <button
                  onClick={() => handleOpenCategory('edit', cat)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-rose-400 border border-slate-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Category Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.skills?.map((skill) => (
                <div
                  key={skill.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                      <DynamicIcon name={skill.icon} className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 text-xs">{skill.name}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => handleReorderSkill(skill, 'up')}
                      className="p-1 text-slate-400 hover:text-cyan-400"
                      title="Move Skill Up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleReorderSkill(skill, 'down')}
                      className="p-1 text-slate-400 hover:text-cyan-400"
                      title="Move Skill Down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenSkill('edit', skill)}
                      className="p-1 text-slate-400 hover:text-cyan-400"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="p-1 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

      {/* Category Modal */}
      {categoryModal.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="glass-card max-w-lg w-full rounded-2xl border border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
            <div className="p-5 sm:p-6 pb-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-950/60">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-cyan-400" />
                {categoryModal.mode === 'create' ? 'Add Skill Category' : 'Edit Category'}
              </h3>
              <button
                type="button"
                onClick={() => setCategoryModal({ open: false, mode: 'create', data: null })}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g. AI & Machine Learning"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Display Order</label>
                  <input
                    type="number"
                    value={categoryForm.order}
                    onChange={(e) => setCategoryForm({ ...categoryForm, order: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-slate-800/80 flex items-center justify-end gap-3 shrink-0 bg-slate-950/80 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setCategoryModal({ open: false, mode: 'create', data: null })}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {skillModal.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="glass-card max-w-lg w-full rounded-2xl border border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
            <div className="p-5 sm:p-6 pb-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-950/60">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                {skillModal.mode === 'create' ? 'Add Technical Skill' : 'Edit Skill'}
              </h3>
              <button
                type="button"
                onClick={() => setSkillModal({ open: false, mode: 'create', data: null })}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Skill Name *</label>
                  <input
                    type="text"
                    required
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    placeholder="e.g. PyTorch"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Category *</label>
                  <select
                    required
                    value={skillForm.categoryId}
                    onChange={(e) => setSkillForm({ ...skillForm, categoryId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Lucide Icon Name</label>
                  <select
                    value={skillForm.icon}
                    onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500"
                  >
                    {availableIcons.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-slate-800/80 flex items-center justify-end gap-3 shrink-0 bg-slate-950/80 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setSkillModal({ open: false, mode: 'create', data: null })}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all disabled:opacity-50"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsManager;
