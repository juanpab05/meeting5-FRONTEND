import { useNavigate } from "react-router";
import { CinemaLogo } from "../components/CinemaLogo";
import { useState } from "react";
import { fetchRegisterUser } from "../api/user";

export const SignUP: React.FC = () => {
  const [formulario, setFormulario] = useState({ name: "", surname: "", age: 0, email: "", password: "", confirmPassword: "" });
  const [showMessage, setShowMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");
    setShowMessage(false);

    if (formulario.password.length < 8) {
      setShowMessage(true);
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
    <>
      <div className="border border-gray-800 flex flex-col items-center justify-center px-4 bg-black bg-gray-900/50 rounded-3xl text-white p-2 mb-16">
        <div className="ml-8 mr-8 flex flex-col items-center">
          {/* Logo */}
          <button
            onClick={() => navigate("/home")}
            aria-label="Ir a la página de inicio"
            className="mt-8 mb-8 cursor-pointer"
          >
            <CinemaLogo size="w-32 h-32" />
          </button>

          <h2 className="text-2xl font-bold mb-2 text-center">Crear cuenta</h2>
          <p className="text-gray-400 text-sm mb-8 text-center max-w-sm">
            Únete a <span className="text-red-500 font-semibold">Cinema Space</span> y disfruta de miles de películas.
          </p>

          {/* Registration form */}
          <form
            onSubmit={handleSubmit}
            method="POST"
            className="grid grid-cols-1 gap-4 w-full"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col w-full">
                <label htmlFor="name" className="sr-only">Nombres</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formulario.name}
                  placeholder="Nombres"
                  required
                  className="mb-3 bg-white rounded-lg h-10 border border-gray-400 p-2 text-sm text-black placeholder-gray-500 w-full focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="mb-3 bg-white rounded-lg h-10 border border-gray-400 p-2 text-sm text-black placeholder-gray-500 w-full focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={handleChange}
                />

                <label htmlFor="age" className="sr-only">Edad</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formulario.age}
                  placeholder="Edad"
                  required
                  min="13"
                  max="100"
                  className="mb-3 bg-white rounded-lg h-10 border border-gray-400 p-2 text-sm text-black placeholder-gray-500 w-full focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col w-full">
                <label htmlFor="email" className="sr-only">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formulario.email}
                  placeholder="Correo electrónico"
                  required
                  className="mb-3 bg-white rounded-lg h-10 border border-gray-400 p-2 text-sm text-black placeholder-gray-500 w-full focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="mb-3 bg-white rounded-lg h-10 border border-gray-400 p-2 text-sm text-black placeholder-gray-500 w-full focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={handleChange}
                />

                {showMessage && (
                  <p className="mb-2 text-white" role="alert">
                    La contraseña debe tener al menos 8 caracteres
                  </p>
                )}

                <label htmlFor="confirmPassword" className="sr-only">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formulario.confirmPassword}
                  placeholder="Confirmar contraseña"
                  required
                  className="mb-3 bg-white rounded-lg h-10 border border-gray-400 p-2 text-sm text-black placeholder-gray-500 w-full focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
              <button
                type="submit"
                className="cursor-pointer mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors w-full md:w-auto"
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

          <div className="flex flex-wrap justify-center gap-2 mt-6 mb-10 text-sm text-gray-300">
            ¿Ya tienes una cuenta?
            <button
              onClick={() => navigate("/sign-in")}
              className="text-blue-400 hover:text-blue-500 cursor-pointer"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUP;