

import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useEffect } from 'react';

export const LoginPage = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const error = searchParams.get('error');
        if (error) {
            toast.error('Error de autenticación: ' + (error === 'missing_params' ? 'Faltan parámetros de sesión' : 'Datos de usuario inválidos'));
        }
    }, [searchParams]);

    const handleGoogleLogin = () => {
        // Redirect to real Backend OAuth2 Endpoint
        window.location.href = 'http://localhost:3000/api/auth/google';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg border-t-8 border-blue-700 overflow-hidden">
                <div className="p-8 flex flex-col items-center text-center">

                    {/* Logo Section */}
                    <div className="mb-6">
                        {/* Placeholder for when the user adds the real logo */}
                        <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-2 overflow-hidden mx-auto border-4 border-blue-100">
                            <img
                                src="/logo.png"
                                alt="BAS Logo"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).parentElement!.classList.add('after:content-["LOGO"]', 'after:text-slate-400', 'after:font-bold');
                                }}
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">BAS Pet Shop</h1>
                        <p className="text-blue-600 font-medium italic">"Tu mascota feliz"</p>
                    </div>

                    <div className="w-full space-y-4">
                        <p className="text-sm text-slate-500 mb-6 font-medium">
                            Ingresá con tu cuenta corporativa
                        </p>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continuar con Google
                        </button>
                    </div>

                    <div className="mt-8 text-xs text-slate-400">
                        &copy; {new Date().getFullYear()} Sistema de Gestión BAS
                    </div>
                </div>
            </div>
        </div>
    );
};
