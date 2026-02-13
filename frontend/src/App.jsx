import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CategoriesPage from './pages/CategoriesPage';
import TagsPage from './pages/TagsPage';

function AppLayout({ children }) {
    return (
        <div className="app-layout">
            <Navbar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

export default function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
            />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <DashboardPage />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/categories"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <CategoriesPage />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/tags"
                element={
                    <ProtectedRoute>
                        <AppLayout>
                            <TagsPage />
                        </AppLayout>
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
