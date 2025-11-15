import { useState } from "react";
import { CinemaLogo } from "../components/CinemaLogo";
import { useNavigate } from "react-router";
import { fetchRecoverPassword } from "../api/reset-password";

export const RecoverPassword: React.FC = () => {
  const [formulario, setFormulario] = useState({email: ""})
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formulario.email)) {
      setErrorMessage("Ingresa un correo electrónico válido.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetchRecoverPassword(formulario.email);

      if (response.ok) {
        setSuccessMessage(`Se enviaron instrucciones a ${formulario.email}.`);
        setFormulario({ email: "" });
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "No se pudo enviar el correo. Intenta más tarde.");
      }
    } catch (error: any) {
      setErrorMessage("Ocurrió un error en el servidor. Inténtalo más tarde.");
      console.error("RecoverPassword error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormulario({...formulario, [e.target.name]: e.target.value, });
  };

  const handleBackToLogin = () => {
    navigate("/sign-in");
  };

  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleGoHome}
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Ir a la página de inicio"
            >
              <CinemaLogo size="w-32 h-32"/>
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-white text-3xl font-bold mb-3" id="recover-password-title">Recuperar contraseña</h1>
            <p className="text-gray-400 text-base" id="recover-password-desc">
              Ingresa tu correo para recibir las instrucciones de recuperación
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" aria-labelledby="recover-password-title">
            <div>
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Correo electrónico"
                value={formulario.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="bg-white rounded-xl h-12 px-5 text-base text-black placeholder-gray-500 outline-none w-full focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-disabled={loading}
              />
            </div>

            {/* Error message */}
            {errorMessage && (
              <div role="alert" className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{errorMessage}</p>
              </div>
            )}

            {/* Success message */}
            {successMessage && (
              <div role="status" className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-green-400 text-sm text-center">{successMessage}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              aria-disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar instrucciones"}
            </button>
          </form>

          {/* Back to login link */}
          <div className="flex justify-center mt-8">
            <button 
              onClick={handleBackToLogin}
              disabled={loading}
              className="text-blue-400 hover:text-blue-500 font-medium transition-colors disabled:opacity-50"
              aria-disabled={loading}
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;