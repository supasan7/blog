import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (err) {
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
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
        if (!newName.trim()) return;
        setCreating(true);
        setError('');
        try {
            await categoryService.createCategory(newName.trim());
            setNewName('');
            setSuccess('Category created successfully!');
            await fetchCategories();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to create category';
            setError(msg);
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        setError('');
        try {
            await categoryService.deleteCategory(id);
            setDeleteConfirm(null);
            setSuccess('Category deleted successfully!');
            await fetchCategories();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to delete category';
            setError(msg);
            setDeleteConfirm(null);
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner-lg"></div>
                <p>Loading categories...</p>
            </div>
        );
    }

    return (
        <div className="categories-page fade-in">
            <div className="page-header">
                <h1>Categories</h1>
                <p className="page-subtitle">Organize your blog posts into categories</p>
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
                <h3>Create New Category</h3>
                <div className="create-form-row">
                    <input
                        id="category-name-input"
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. Technology, Travel, Food..."
                        maxLength={50}
                        disabled={creating}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={creating || !newName.trim()}
                        id="create-category-button"
                    >
                        {creating ? <span className="spinner"></span> : 'Create'}
                    </button>
                </div>
                <p className="form-hint">2-50 characters, letters, numbers, spaces and hyphens only</p>
            </form>

            <div className="table-container glass-card">
                <table className="data-table" id="categories-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Posts</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="empty-cell">
                                    No categories found. Create your first one above!
                                </td>
                            </tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat.id}>
                                    <td className="cell-name">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                        </svg>
                                        {cat.name}
                                    </td>
                                    <td>
                                        <span className="badge">{cat.postCount} posts</span>
                                    </td>
                                    <td>
                                        {deleteConfirm === cat.id ? (
                                            <div className="confirm-actions">
                                                <button
                                                    className="btn btn-danger btn-xs"
                                                    onClick={() => handleDelete(cat.id)}
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
                                                onClick={() => setDeleteConfirm(cat.id)}
                                                title="Delete category"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
