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
      setErrorMessage("Ocurrió un error en el servidor. Comprueba la conexion");
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

  return (
    <div className="min-h-screen bg-meeting5 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
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

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-black text-2xl lg:text-3xl font-bold text-shadow-lg" id="recover-password-title">Recuperar contraseña</h1>
            <p className="text-gray-400 text-base" id="recover-password-desc">
              Recibe un enlace para restablecer tu contraseña
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
                className="bg-white border border-gray-400 rounded-xl h-12 px-5 text-base placeholder-gray-400 outline-none w-full focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="text-gray-400 text-center text-sm mb-2">Te enviaremos un enlace para restablecer tu contraseña</p>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1D4ED8] hover:bg-[#1943B8] text-xl text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              aria-disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </form>

          {/* Back to login link */}
          <div className="flex justify-center mt-8">
            <button 
              onClick={handleBackToLogin}
              disabled={loading}
              className="text-gray-400 hover:text-blue-500 font-medium transition-colors disabled:opacity-50"
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