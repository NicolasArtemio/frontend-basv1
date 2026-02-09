import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/infrastructure/auth_session_manager';
import { Loader2 } from 'lucide-react';

export const GoogleCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        // Support both backend styles (NestJS standard vs custom)
        const token = searchParams.get('token') || searchParams.get('access_token');
        const userDataStr = searchParams.get('user');

        if (token && userDataStr) {
            try {
                // Decode and parse the user JSON string from query params
                const userData = JSON.parse(decodeURIComponent(userDataStr));

                // Persist real data in Zustand / LocalStorage
                login(userData, token);

                // Final Redirect to Admin Panel
                navigate('/admin');
            } catch (error) {
                console.error("Error parsing user data from Google callback:", error);
                navigate('/login?error=invalid_user_data');
            }
        } else {
            console.error("Missing token or user data in Google callback URL");
            navigate('/login?error=missing_params');
        }
    }, [searchParams, login, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                    Autenticando con <span className="text-blue-600">Google</span>
                </h2>
                <p className="text-slate-500 animate-pulse">Sincronizando tu identidad con BAS Pet Shop...</p>
            </div>
        </div>
    );
};
