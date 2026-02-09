import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/infrastructure/auth_session_manager';

export const ProtectedRoute = () => {
    const { isAuthenticated, user } = useAuthStore();
    const ADMIN_EMAIL = 'nicolasartemiodume@gmail.com';

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Specific check for Admin Access
    // In a real app coverage, we might want a generic 'allowedRoles' prop.
    // For this specific requirement:
    if (user?.email !== ADMIN_EMAIL) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
