import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { CinemaLogo } from "../components/CinemaLogo"
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

  const handleForgotPassword = () => {
    navigate("/recover-password")
  }

  const handleSignUp = () => {
    navigate("/sign-up")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Card Container */}
      <div className="w-full flex max-w-md md:max-w-lg lg:max-w-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Card Content */}
        <div className="w-100 p-8 md:p-12 lg:px-16 lg:py-12">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <CinemaLogo size="w-32 h-32"/>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-white text-3xl lg:text-4xl font-bold mb-3">Iniciar sesión</h1>
            <p className="text-gray-400 text-base">
              Bienvenido de vuelta a <span className="text-red-500 font-semibold">Cinema Space</span>
            </p>
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
                className="bg-white rounded-xl h-12 px-5 text-base text-black placeholder-gray-500 outline-none w-full focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
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

            {/* Forgot password link */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="text-blue-400 hover:text-blue-500 text-sm transition-colors disabled:opacity-50"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{errorMessage}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Sign up link */}
          <div className="flex flex-wrap justify-center gap-2 mt-8 text-gray-300">
            <span>¿No tienes una cuenta?</span>
            <button 
              onClick={handleSignUp} 
              disabled={isLoading}
              className="text-blue-400 hover:text-blue-500 font-medium transition-colors disabled:opacity-50"
            >
              Regístrate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;