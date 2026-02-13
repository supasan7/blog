import { useState, useEffect } from 'react';
import { tagService } from '../services/tagService';

export default function TagsPage() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const fetchTags = async () => {
        try {
            const data = await tagService.getTags();
            setTags(data);
        } catch (err) {
            setError('Failed to load tags');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleCreate = async (e) => {
        e.preventDefault();
        const names = input
            .split(',')
            .map((n) => n.trim())
            .filter((n) => n.length > 0);

        if (names.length === 0) return;

        if (names.length > 10) {
            setError('Maximum 10 tags at a time');
            return;
        }

        for (const name of names) {
            if (name.length < 2 || name.length > 30) {
                setError(`Tag "${name}" must be between 2 and 30 characters`);
                return;
            }
        }

        setCreating(true);
        setError('');
        try {
            await tagService.createTags(names);
            setInput('');
            setSuccess(`${names.length} tag(s) created successfully!`);
            await fetchTags();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to create tags';
            setError(msg);
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        setError('');
        try {
            await tagService.deleteTag(id);
            setDeleteConfirm(null);
            setSuccess('Tag deleted successfully!');
            await fetchTags();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to delete tag';
            setError(msg);
            setDeleteConfirm(null);
        }
    };

    const previewNames = input
        .split(',')
        .map((n) => n.trim())
        .filter((n) => n.length > 0);

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner-lg"></div>
                <p>Loading tags...</p>
            </div>
        );
    }

    return (
        <div className="tags-page fade-in">
            <div className="page-header">
                <h1>Tags</h1>
                <p className="page-subtitle">Label and organize your blog content</p>
            </div>

            {error && (
                <div className="alert alert-error" role="alert">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success" role="status">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {success}
                </div>
            )}

            <form onSubmit={handleCreate} className="create-form glass-card">
                <h3>Create New Tags</h3>
                <div className="create-form-row">
                    <input
                        id="tag-names-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g. React, JavaScript, CSS"
                        disabled={creating}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={creating || previewNames.length === 0}
                        id="create-tags-button"
                    >
                        {creating ? <span className="spinner"></span> : `Create (${previewNames.length})`}
                    </button>
                </div>
                <p className="form-hint">Separate multiple tags with commas. 2-30 characters each, max 10 tags.</p>

                {previewNames.length > 0 && (
                    <div className="tag-preview">
                        <span className="preview-label">Preview:</span>
                        {previewNames.map((name, i) => (
                            <span key={i} className="tag-chip tag-chip-preview">
                                {name}
                            </span>
                        ))}
                    </div>
                )}
            </form>

            <div className="glass-card">
                <div className="section-header">
                    <h2>All Tags ({tags.length})</h2>
                </div>
                {tags.length === 0 ? (
                    <div className="empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="empty-icon">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                            <line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                        <p>No tags yet. Create your first tags above!</p>
                    </div>
                ) : (
                    <div className="tag-chips-grid">
                        {tags.map((tag) => (
                            <div key={tag.id} className="tag-chip-card">
                                <div className="tag-chip-info">
                                    <span className="tag-chip-name">{tag.name}</span>
                                    <span className="tag-chip-count">{tag.postCount} posts</span>
                                </div>
                                {deleteConfirm === tag.id ? (
                                    <div className="confirm-actions">
                                        <button
                                            className="btn btn-danger btn-xs"
                                            onClick={() => handleDelete(tag.id)}
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-xs"
                                            onClick={() => setDeleteConfirm(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-ghost btn-xs btn-icon-danger"
                                        onClick={() => setDeleteConfirm(tag.id)}
                                        title="Delete tag"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
