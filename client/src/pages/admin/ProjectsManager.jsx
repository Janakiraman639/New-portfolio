
import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import api from '../../api/axios';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Upload,
  ExternalLink,
  Github,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Star,
  GripVertical,
} from 'lucide-react';

const ProjectsManager = () => {
  const { portfolio, refreshPortfolio } = usePortfolio();
  const projects = portfolio?.projects || [];

  const [modal, setModal] = useState({
    open: false,
    mode: 'create',
    data: null,
  });

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    shortDesc: '',
    fullDesc: '',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    technologies: '',
    featured: false,
    order: 0,
  });

  const resetForm = () => {
    setForm({
      title: '',
      shortDesc: '',
      fullDesc: '',
      imageUrl: '',
      githubUrl: '',
      liveUrl: '',
      technologies: '',
      featured: false,
      order: projects.length + 1,
    });
  };

  const handleOpenModal = (mode, project = null) => {
    setStatus(null);

    if (mode === 'edit' && project) {
      setForm({
        title: project.title || '',
        shortDesc: project.shortDesc || '',
        fullDesc: project.fullDesc || '',
        imageUrl: project.imageUrl || '',
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        technologies: Array.isArray(project.technologies)
          ? project.technologies.join(', ')
          : project.technologies || '',
        featured: project.featured ?? false,
        order: project.order || 0,
      });
    } else {
      resetForm();
    }

    setModal({
      open: true,
      mode,
      data: project,
    });
  };

  const closeModal = () => {
    if (loading || uploading) return;

    setModal({
      open: false,
      mode: 'create',
      data: null,
    });

    resetForm();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Basic image validation
    if (!file.type.startsWith('image/')) {
      setStatus({
        type: 'error',
        message: 'Please select a valid image file.',
      });
      return;
    }

    const bodyData = new FormData();
    bodyData.append('file', file);

    setUploading(true);
    setStatus(null);

    try {
      const res = await api.post('/admin/upload', bodyData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success) {
        setForm((prev) => ({
          ...prev,
          imageUrl: res.data.fileUrl,
        }));

        setStatus({
          type: 'success',
          message: 'Image uploaded successfully.',
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Image upload failed.',
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setStatus({
        type: 'error',
        message: 'Project title is required.',
      });
      return;
    }

    if (!form.shortDesc.trim()) {
      setStatus({
        type: 'error',
        message: 'Short description is required.',
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    const techArray = form.technologies
      ? form.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const payload = {
      ...form,
      title: form.title.trim(),
      shortDesc: form.shortDesc.trim(),
      fullDesc: form.fullDesc.trim(),
      technologies: techArray,
      order: Number(form.order) || 0,
    };

    try {
      if (modal.mode === 'create') {
        await api.post('/admin/projects', payload);
      } else {
        await api.put(
          `/admin/projects/${modal.data.id}`,
          payload
        );
      }

      await refreshPortfolio();

      setModal({
        open: false,
        mode: 'create',
        data: null,
      });

      resetForm();

      setStatus({
        type: 'success',
        message:
          modal.mode === 'create'
            ? 'Project added successfully!'
            : 'Project updated successfully!',
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message:
          err?.response?.data?.message ||
          'Failed to save project.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmed) return;

    setStatus(null);

    try {
      await api.delete(`/admin/projects/${id}`);

      await refreshPortfolio();

      setStatus({
        type: 'success',
        message: 'Project deleted successfully!',
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Failed to delete project.',
      });
    }
  };

  return (
    <div className="min-h-full space-y-7 animate-fade-in">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Layers className="w-6 h-6 text-cyan-400" />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-white">
                Projects Management
              </h1>

              <p className="text-slate-400 text-sm mt-1">
                Manage and showcase your portfolio projects.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => handleOpenModal('create')}
          className="px-5 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Project
        </button>
      </div>

      {/* STATUS */}
      {status && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 border ${
            status.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}

          <span>{status.message}</span>
        </div>
      )}

      {/* PROJECT COUNT */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">
            Your Projects
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            {projects.length} project
            {projects.length !== 1 ? 's' : ''} in your portfolio
          </p>
        </div>
      </div>

      {/* EMPTY STATE */}
      {projects.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-cyan-400" />
          </div>

          <h3 className="text-lg font-bold text-white mt-5">
            No Projects Added Yet
          </h3>

          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Add your first project to display it on your portfolio.
          </p>

          <button
            onClick={() => handleOpenModal('create')}
            className="mt-5 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Your First Project
          </button>
        </div>
      )}

      {/* PROJECT GRID */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {projects.map((proj, index) => (
            <div
              key={proj.id}
              className="group rounded-2xl overflow-hidden bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 shadow-xl shadow-black/10"
            >

              {/* IMAGE */}
              <div className="relative h-56 bg-slate-950 overflow-hidden">

                {proj.imageUrl ? (
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900">
                    <Sparkles className="w-12 h-12 text-cyan-400 mb-2" />
                    <span className="text-xs text-slate-500">
                      No project image
                    </span>
                  </div>
                )}

                {/* DARK GRADIENT */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70" />

                {/* PROJECT NUMBER */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <GripVertical className="w-3.5 h-3.5" />
                    #{index + 1}
                  </div>
                </div>

                {/* FEATURED */}
                {proj.featured && (
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1.5 rounded-lg bg-cyan-500/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      Featured
                    </div>
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-6">

                {/* TITLE */}
                <h3 className="text-xl font-extrabold text-white leading-tight">
                  {proj.title}
                </h3>

                {/* SHORT DESCRIPTION */}
                <p className="text-sm text-slate-400 leading-6 mt-3 min-h-[72px]">
                  {proj.shortDesc || 'No description available.'}
                </p>

                {/* TECHNOLOGIES */}
                {Array.isArray(proj.technologies) &&
                  proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {proj.technologies.slice(0, 6).map((tech, i) => (
                        <span
                          key={`${tech}-${i}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}

                      {proj.technologies.length > 6 && (
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-semibold text-cyan-400">
                          +{proj.technologies.length - 6} more
                        </span>
                      )}
                    </div>
                  )}

                {/* LINKS */}
                <div className="flex flex-wrap gap-2 mt-5">

                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}

                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/20 text-cyan-400 text-xs font-semibold flex items-center gap-2 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-800">

                  <button
                    onClick={() => handleOpenModal('edit', proj)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Project
                  </button>

                  <button
                    onClick={() => handleDelete(proj.id)}
                    className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-400 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modal.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md overflow-y-auto">

          <div className="min-h-screen flex items-center justify-center p-4">

            <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">

              {/* MODAL HEADER */}
              <div className="sticky top-0 z-10 px-6 py-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">

                <div>
                  <h3 className="text-xl font-bold text-white">
                    {modal.mode === 'create'
                      ? 'Add New Project'
                      : 'Edit Project'}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Fill in the project information below.
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  className="w-9 h-9 rounded-lg hover:bg-slate-800 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5"
              >

                {/* TITLE */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Project Title *
                  </label>

                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        title: e.target.value,
                      })
                    }
                    placeholder="e.g. AI E-Commerce System"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* SHORT DESCRIPTION */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Short Summary *
                  </label>

                  <textarea
                    required
                    rows={3}
                    value={form.shortDesc}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        shortDesc: e.target.value,
                      })
                    }
                    placeholder="Write a clear 1-3 sentence project summary..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                {/* FULL DESCRIPTION */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Detailed Description
                  </label>

                  <textarea
                    rows={6}
                    value={form.fullDesc}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        fullDesc: e.target.value,
                      })
                    }
                    placeholder="Explain the project, architecture, features, implementation, and technologies..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 resize-y"
                  />
                </div>

                {/* IMAGE */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Project Cover Image
                  </label>

                  <div className="flex gap-3">

                    <input
                      type="text"
                      value={form.imageUrl}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          imageUrl: e.target.value,
                        })
                      }
                      placeholder="/uploads/project.jpg or image URL"
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />

                    <label className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer flex items-center gap-2">
                      {uploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}

                      {uploading ? 'Uploading...' : 'Upload'}

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>

                  {/* IMAGE PREVIEW */}
                  {form.imageUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                      <img
                        src={form.imageUrl}
                        alt="Project preview"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* URLS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      GitHub Repository
                    </label>

                    <input
                      type="url"
                      value={form.githubUrl}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          githubUrl: e.target.value,
                        })
                      }
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      Live Demo
                    </label>

                    <input
                      type="url"
                      value={form.liveUrl}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          liveUrl: e.target.value,
                        })
                      }
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                </div>

                {/* TECHNOLOGIES */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Technologies
                  </label>

                  <input
                    type="text"
                    value={form.technologies}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        technologies: e.target.value,
                      })
                    }
                    placeholder="Python, FastAPI, React, MySQL"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />

                  <p className="text-[11px] text-slate-500 mt-2">
                    Separate technologies using commas.
                  </p>
                </div>

                {/* FEATURED */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">

                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        featured: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-cyan-600 focus:ring-cyan-500"
                  />

                  <div>
                    <label
                      htmlFor="featured"
                      className="text-sm font-bold text-white cursor-pointer"
                    >
                      Featured Project
                    </label>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Highlight this project on your portfolio.
                    </p>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="pt-5 border-t border-slate-800 flex justify-end gap-3">

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={loading}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-cyan-600/20 flex items-center gap-2"
                  >
                    {loading && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}

                    {loading
                      ? 'Saving...'
                      : modal.mode === 'create'
                      ? 'Add Project'
                      : 'Save Changes'}
                  </button>

                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;

