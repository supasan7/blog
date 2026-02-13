import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-backdrop">
                <div className="backdrop-orb orb-1"></div>
                <div className="backdrop-orb orb-2"></div>
                <div className="backdrop-orb orb-3"></div>
            </div>
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">✦</div>
                    <h1>Blog Admin</h1>
                    <p>Sign in to manage your blog</p>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
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
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            autoComplete="email"
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={loading}
                        id="login-button"
                    >
                        {loading ? (
                            <span className="spinner"></span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
