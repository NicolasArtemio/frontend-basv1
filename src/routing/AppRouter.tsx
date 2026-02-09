import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminPage } from '@/ui/components/Pages';
import { HomePage } from '@/ui/pages/HomePage';
import { LoginPage } from '@/ui/pages/LoginPage';
import { GoogleCallback } from '@/ui/pages/GoogleCallback';
import { AdminLayout } from '@/ui/layouts/AdminLayout';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/auth/google/callback" element={<GoogleCallback />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route path="/admin" element={<AdminPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
