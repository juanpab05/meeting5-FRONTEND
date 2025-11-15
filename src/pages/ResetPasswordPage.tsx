import React, { useState, useEffect, useRef } from 'react';
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
  const handleGoToLogin = () => navigate('/sign-in');
  const timeoutRef = useRef<number | null>(null);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Token no válido. Por favor, usa el enlace completo del correo.');
    }
  }, []);



  // navigate to sign-in when success becomes true (keeps a short delay)
  useEffect(() => {
    if (success) {
      const tid = window.setTimeout(() => navigate('/sign-in'), 3000);
      timeoutRef.current = tid;
    }
  }, [success, navigate]);

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
    } catch (error: any) {
      setError(error.message || 'Error al restablecer la contraseña.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-meeting5 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <button
                onClick={() => navigate("/")}
                aria-label="Ir a la página de inicio"
                className="cursor-pointer"
              >
                <img src="logo.svg" className="w-28 rounded-xl" alt="Logo de meeting5" />
            </button>
          </div>
          </div>
          {/*Title*/}
          <div className="text-center mb-8">
            <h1 className="text-black text-2xl lg:text-3xl font-bold text-shadow-lg" id="reset-password-title">Restablecer Contraseña</h1>
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
                className="bg-white border border-gray-400 rounded-xl h-12 px-5 text-base text-black placeholder-gray-500 outline-none w-full focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="bg-white border border-gray-400 rounded-xl h-12 px-5 text-base text-black placeholder-gray-500 outline-none w-full focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {error && (
              <div role="alert" className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
            {success && (
              <div role="alert" className="bg-green-500/10 border border-green-500 rounded-lg p-3">
                <p className="text-green-400 text-sm text-center">Contraseña restablecida con éxito. Serás redirigido al inicio de sesión.</p>
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading || !token}
              aria-disabled={isLoading || !token}
              className="w-full bg-[#1D4ED8] hover:bg-[#1943B8] text-xl text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Restableciendo..." : "Restablecer Contraseña"}
            </button>
          </form>

          <div className="text-center mt-8 text-gray-400 text-sm">
            Sera redirigido a la pagina de login una vez confirme la contraseña
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
