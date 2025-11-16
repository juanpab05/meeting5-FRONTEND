import { useNavigate } from "react-router";
import { useState } from "react";
import { fetchRegisterUser } from "../api/user";

export const SignUP: React.FC = () => {
  const [formulario, setFormulario] = useState({ name: "", surname: "", age: 0, email: "", password: "", confirmPassword: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");
    
    if (formulario.age <= 0 || isNaN(formulario.age)) {
      setErrorMessage("Por favor, ingresa una edad válida.");
      return;
    }

    if (formulario.password.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (formulario.password !== formulario.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    const userDataSignUP = {
      name: formulario.name,
      surname: formulario.surname,
      age: formulario.age,
      email: formulario.email,
      password: formulario.password,
    };

    try {
      await fetchRegisterUser(userDataSignUP);
      setFormulario({ name: "", surname: "", age: 0, email: "", password: "", confirmPassword: "" });
      navigate("/home");
    } catch (error: any) {
      if (error.message.includes("Internal server error")) {
        setErrorMessage("Ocurrió un error en el servidor. Inténtalo más tarde.");
      } else if (error.message.includes("Invalid request")) {
        setErrorMessage("Los datos enviados no son válidos.");
      } else if (error.message.includes("Unauthorized")) {
        setErrorMessage("No tienes permiso para realizar esta acción.");
      } else {
        setErrorMessage("No se pudo registrar el usuario. Verifica tus datos.");
      }
    }
  };

  return (
      <div className="w-screen bg-meeting5 flex items-center justify-center p-6">
        {/*Sign-up card*/}
      <div className="w-full md:w-full lg:w-1/2 xl:w-1/3 flex flex-col max-w-md md:max-w-lg lg:max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Card Content */}
        <div className="w-full items-center justify-center p-8 md:p-12 lg:px-16 lg:py-12">
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
            <h1 className="text-black text-3xl lg:text-4xl font-bold text-shadow-lg">Crear una cuenta</h1>
          </div>

          {/* Registration form */}
          <form
            onSubmit={handleSubmit}
            method="POST"
            className="grid grid-cols-1 gap-4 w-full"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col w-full gap-2">
                <label htmlFor="name" className="sr-only">Nombres</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formulario.name}
                  placeholder="Nombres"
                  required
                  className="mb-3 rounded-lg h-10 border border-gray-400 p-2 text-sm text-black placeholder-gray-500 w-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={handleChange}
                />

                <label htmlFor="surname" className="sr-only">Apellidos</label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formulario.surname}
                  placeholder="Apellidos"
                  required
                  className="mb-3 rounded-lg h-10 border border-gray-400 p-2 text-sm text-black placeholder-gray-500 w-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={handleChange}
                />
                <label htmlFor="age" className="sr-only">Edad</label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  value={formulario.age}
                  placeholder="Edad"
                  required
                  className="mb-3 rounded-lg h-10 border border-gray-400 p-2 text-sm text-black placeholder-gray-500 w-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={handleChange}
                />
                <label htmlFor="email" className="sr-only">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formulario.email}
                  placeholder="Correo electrónico"
                  required
                  className="mb-3 rounded-lg h-10 border border-gray-400 p-2 text-sm text-black placeholder-gray-500 w-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={handleChange}
                />

                <label htmlFor="password" className="sr-only">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formulario.password}
                  placeholder="Contraseña"
                  required
                  className="mb-3 rounded-lg h-10 border border-gray-400 p-2 text-sm text-black placeholder-gray-500 w-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={handleChange}
                />


                <label htmlFor="confirmPassword" className="sr-only">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formulario.confirmPassword}
                  placeholder="Confirmar contraseña"
                  required
                  className="mb-3 bg-white rounded-lg h-10 border border-gray-400 p-2 text-sm text-black placeholder-gray-500 w-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
              <button
                type="submit"
                className="w-full bg-[#1D4ED8] hover:bg-[#1943B8] text-xl text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Registrarse
              </button>
            </div>
          </form>

          {errorMessage && (
            <p className="text-red-500 text-sm mt-4 text-center" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-2 mt-6 mb-10 text-sm text-gray-500">
            <button
              onClick={() => navigate("/sign-in")}
              className="text-gray-500 hover:text-blue-500 text-sm transition-colors disabled:opacity-50"
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </button>
          </div>
          </div>
        </div>
      </div>
  );
};

export default SignUP;