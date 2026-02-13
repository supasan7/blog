import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import { tagService } from '../services/tagService';

export default function DashboardPage() {
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [catData, tagData] = await Promise.all([
                    categoryService.getCategories(),
                    tagService.getTags(),
                ]);
                setCategories(catData);
                setTags(tagData);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const totalPosts = categories.reduce((sum, c) => sum + c.postCount, 0);

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner-lg"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page fade-in">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p className="page-subtitle">Overview of your blog</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card stat-card-purple">
                    <div className="stat-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                    </div>
                    <div className="stat-details">
                        <span className="stat-number">{totalPosts}</span>
                        <span className="stat-label">Published Posts</span>
                    </div>
                </div>

                <Link to="/categories" className="stat-card stat-card-blue">
                    <div className="stat-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <div className="stat-details">
                        <span className="stat-number">{categories.length}</span>
                        <span className="stat-label">Categories</span>
                    </div>
                    <span className="stat-action">Manage →</span>
                </Link>

                <Link to="/tags" className="stat-card stat-card-green">
                    <div className="stat-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                            <line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                    </div>
                    <div className="stat-details">
                        <span className="stat-number">{tags.length}</span>
                        <span className="stat-label">Tags</span>
                    </div>
                    <span className="stat-action">Manage →</span>
                </Link>
            </div>

            <div className="dashboard-sections">
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>Recent Categories</h2>
                        <Link to="/categories" className="btn btn-sm btn-outline">View All</Link>
                    </div>
                    {categories.length === 0 ? (
                        <div className="empty-state">
                            <p>No categories yet. Create your first category!</p>
                            <Link to="/categories" className="btn btn-primary btn-sm">Create Category</Link>
                        </div>
                    ) : (
                        <div className="mini-list">
                            {categories.slice(0, 5).map((cat) => (
                                <div key={cat.id} className="mini-list-item">
                                    <span className="mini-list-name">{cat.name}</span>
                                    <span className="badge">{cat.postCount} posts</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>Recent Tags</h2>
                        <Link to="/tags" className="btn btn-sm btn-outline">View All</Link>
                    </div>
                    {tags.length === 0 ? (
                        <div className="empty-state">
                            <p>No tags yet. Create your first tags!</p>
                            <Link to="/tags" className="btn btn-primary btn-sm">Create Tags</Link>
                        </div>
                    ) : (
                        <div className="tag-chips">
                            {tags.slice(0, 10).map((tag) => (
                                <span key={tag.id} className="tag-chip">
                                    {tag.name}
                                    <span className="tag-chip-count">{tag.postCount}</span>
                                </span>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
