import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router"
import { useUser } from "../context/UserContext"
import { fetchLoginUser } from "../api/login"

export const LoginPage = () => {
  const [formulario, setFormulario] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const {refreshUser} = useUser();

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      const data = await fetchLoginUser(formulario.email, formulario.password)

      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        refreshUser();
      }

      setFormulario({ email: "", password: "" })
      
      navigate("/home");
        
    } catch (error: any) {
      console.error('Error en login:', error)
      setErrorMessage(error.message || "No se pudo iniciar sesión. Verifica tus datos.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacebookLogin = () => {
    // Implement Facebook login logic here
  }

  const handleGoogleLogin = () => {
    // Implement Google login logic here
  }

  const handleForgotPassword = () => {
    navigate("/recover-password")
  }

  const handleSignUp = () => {
    navigate("/sign-up")
  }

  return (
    <div className="w-screen bg-meeting5 flex items-center justify-center p-6">
      {/* Login card */}
      <div className="w-full md:w-full lg:w-1/2 xl:w-1/3 flex flex-col max-w-md md:max-w-lg lg:max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Card Content */}
        <div className="w-full overflow-hidden items-center justify-center p-8 md:p-12 lg:px-16 lg:py-12">
          {/* Logo */}
          <div className="flex justify-center mb-8">
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
            <h1 className="text-black text-3xl lg:text-4xl font-bold text-shadow-lg">Iniciar sesión</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div>
              <input
                type="email"
                name="email"
                value={formulario.email}
                placeholder="Correo electrónico"
                required
                disabled={isLoading}
                className="rounded-xl border border-gray-400 h-12 px-5 text-base text-black placeholder-gray-500 outline-none w-full focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onChange={handleChange}
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formulario.password}
                placeholder="Contraseña"
                required
                disabled={isLoading}
                className="w-full px-3 py-3 border border-gray-400 rounded-xl dark:bg-gray-700 placeholder-gray-500 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>


            {/* Error message */}
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{errorMessage}</p>
              </div>
            )}

            {/* login button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1D4ED8] hover:bg-[#1943B8] text-xl text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Cargando..." : "Ingresar"}
            </button>
          </form>

          {/* Forgot password link */}
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoading}
                className= "text-center text-gray-500 hover:text-blue-500 text-sm transition-colors disabled:opacity-50"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          
          {/* Social login buttons */}
          <div className="mt-4 flex flex-col gap-6">
            {/* Facebook login button */}
              <button
                type="submit"
                onClick={handleFacebookLogin}
                disabled={isLoading}
                className="w-full bg-meeting5 hover:bg-red-700 text-xl text-[#1D4ED8] font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? "Cargando Facebook..." : "Ingresar"}
              </button>

            {/* Google login button */}
              <button
                type="submit"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-meeting5 hover:bg-red-700 text-xl text-[#32A753] font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? "Cargando Google..." : "Ingresar"}
            </button>
          </div>

          {/* Sign up link */}
          <div className="flex flex-wrap justify-center gap-2 mt-8 text-gray-300">
            <button 
              onClick={handleSignUp} 
              disabled={isLoading}
              className="text-gray-500 hover:text-blue-500 text-sm transition-colors disabled:opacity-50"
>
              ¿No tienes una cuenta? Regístrate
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;