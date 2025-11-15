import React, { useState, useEffect } from 'react';
import { CinemaLogo } from "../components/CinemaLogo";
import { useNavigate } from 'react-router';
import { fetchResetPassword } from '../api/reset-password';

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Token no válido. Por favor, usa el enlace completo del correo.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!newPassword || !confirmPassword) {
      setError('Todos los campos son obligatorios.');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    try {
      await fetchResetPassword(token, newPassword, confirmPassword);
      setSuccess(true);
      setTimeout(() => navigate('/sign-in'), 3000);
    } catch (error: any) {
      setError(error.message || 'Error al restablecer la contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => navigate('/sign-in');
  const handleGoHome = () => navigate('/home');

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <button
                onClick={handleGoHome}
                className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
                aria-label="Ir a la página de inicio"
              >
                <CinemaLogo size="w-32 h-32" />
              </button>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-white text-3xl font-bold mb-3" id="reset-success-title">¡Contraseña Restablecida!</h1>
              <p className="text-gray-400 text-base mb-2" id="reset-success-desc">
                Tu contraseña ha sido restablecida exitosamente.
              </p>
              <p className="text-gray-400 text-sm">
                Serás redirigido al login en unos segundos...
              </p>
            </div>

            <button
              onClick={handleGoToLogin}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Ir al Login Ahora
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <button
              onClick={handleGoHome}
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Ir a la página de inicio"
            >
              <CinemaLogo size='lg' />
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-white text-3xl font-bold mb-3" id="reset-password-title">Restablecer Contraseña</h1>
            <p className="text-gray-400 text-base" id="reset-password-desc">
              Ingresa tu nueva contraseña
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" aria-labelledby="reset-password-title">
            <div>
              <label htmlFor="newPassword" className="sr-only">Nueva contraseña</label>
              <input
                id="newPassword"
                type="password"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
                aria-disabled={isLoading}
                className="bg-white rounded-xl h-12 px-5 text-base text-black placeholder-gray-500 outline-none w-full focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                aria-disabled={isLoading}
                className="bg-white rounded-xl h-12 px-5 text-base text-black placeholder-gray-500 outline-none w-full focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {error && (
              <div role="alert" className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !token}
              aria-disabled={isLoading || !token}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Restableciendo..." : "Restablecer Contraseña"}
            </button>
          </form>

          <div className="flex justify-center mt-8">
            <button 
              onClick={handleGoToLogin}
              disabled={isLoading}
              aria-disabled={isLoading}
              className="text-blue-400 hover:text-blue-500 font-medium transition-colors disabled:opacity-50"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
