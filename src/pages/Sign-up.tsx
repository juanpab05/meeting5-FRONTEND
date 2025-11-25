import { useNavigate } from "react-router";
import { useState } from "react";
import { fetchRegisterUser } from "../api/user";

/**
 * Sign-up page component.
 *
 * Renders a registration form and handles client-side validation before
 * calling the API via `fetchRegisterUser`. On successful registration the
 * user is redirected to the home page.
 *
 * State:
 * - `formulario`: holds the form fields (first name, last name, email, password, confirmPassword).
 * - `age`: string-backed input for the age field (converted to number before submit).
 * - `errorMessage`: error text shown to the user when validation or API fails.
 */
export const SignUP: React.FC = () => {
  const [formulario, setFormulario] = useState({ firstName: "", lastName: "", age: 0, email: "", password: "", confirmPassword: "" });
  const [age, setAge] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [ageError, setAgeError] = useState("");
  const hasErrors =
  !!passwordError ||
  !!confirmPasswordError ||
  !!emailError ||
  !!ageError ||
  Object.values(formulario).some((field) => field === "");

  const navigate = useNavigate();

  /**
   * Handle changes on input fields and sync them into `formulario`.
   * @param e - Input change event
   */

  const validatePassword = (password: string) => {
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (!/[A-Z]/.test(password)) return "La contraseña debe contener al menos una mayúscula.";
    if (!/[0-9]/.test(password)) return "La contraseña debe contener al menos un número.";
    if (!/[^A-Za-z0-9]/.test(password)) return "La contraseña debe contener al menos un símbolo.";
    return null;
  };

  const validatePasswordEquality = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) return "Las contraseñas no coinciden.";
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormulario({ ...formulario, [name]: value });

    if (name === "password") {
      const error = validatePassword(
        name === "password" ? value : formulario.password
      );
      setPasswordError(error || "");
    }

    if (name === "confirmPassword") {
      setConfirmPasswordError(
        validatePasswordEquality(formulario.password, value) || ""
      );
    }

    if (name === "email") {
      if (!value.includes("@")) {
        setEmailError("El correo debe contener '@'.");
      } else if (!value.includes(".")) {
        setEmailError("El correo debe contener un punto '.'");
      } else {
        setEmailError("");
      }
    }

  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAge(value);

    if (Number(value) <= 0 || isNaN(Number(value))) {
      setAgeError("Debes ingresar una edad válida.");
    } else {
      setAgeError("");
    }
  };



  /**
   * Validate password strength and equality.
   * Returns an error string when validation fails or `null` when valid.
   */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    formulario.age = Number(age);

    if (formulario.age <= 0 || isNaN(formulario.age)) {
      setErrorMessage("Por favor, ingresa una edad válida.");
      return;
    }

    const error = validatePassword(formulario.password);
    if (error) {
      setErrorMessage(error);
      return;
    }

    setErrorMessage("");

    const userDataSignUP = {
      firstName: formulario.firstName,
      lastName: formulario.lastName,
      age: formulario.age,
      email: formulario.email,
      password: formulario.password,
    };

    try {
      await fetchRegisterUser(userDataSignUP);
      setFormulario({ firstName: "", lastName: "", age: 0, email: "", password: "", confirmPassword: "" });
      navigate("/");
    } catch (error: any) {
      if (error.message.includes("Internal server error")) {
        setErrorMessage("Ocurrió un error en el servidor. Inténtalo más tarde.");
      } else if (error.message.includes("Invalid request")) {
        setErrorMessage("Los datos enviados no son válidos.");
      } else if (error.message.includes("Unauthorized")) {
        setErrorMessage("No tienes permiso para realizar esta acción.");
      }
      else if (error.message.includes("Email is already registered")) {
        setErrorMessage("El correo electrónico ya está registrado.");
      }
      else {
        setErrorMessage("No se pudo registrar el usuario.");
      }
    }
  };

  /**
   * Submit handler for the registration form.
   * - Converts `age` to number and validates inputs.
   * - Calls `fetchRegisterUser` and redirects on success.
   * - Displays friendly error messages based on API responses.
   */

  return (
    <div className="w-full min-h-screen bg-meeting5 flex items-center justify-center p-6">
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
                <label htmlFor="firstName" className="sr-only">Nombres</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formulario.firstName}
                  placeholder="Nombres"
                  required
                  className="mb-3 rounded-lg h-10 border border-gray-400 p-2 text-sm text-black placeholder-gray-500 w-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={handleChange}
                />

                <label htmlFor="lastName" className="sr-only">Apellidos</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formulario.lastName}
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
                  value={age}
                  placeholder="Edad"
                  required
                  className="mb-3 rounded-lg h-10 border border-gray-400 p-2 text-sm text-black placeholder-gray-500 w-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={handleAgeChange}
                />
                {ageError && <p className="text-red-500 text-xs mb-3">{ageError}</p>}

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
                {emailError && <p className="text-red-500 text-xs mb-3">{emailError}</p>}

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
                {passwordError && (
                  <p className="text-red-500 text-xs mb-3">{passwordError}</p>
                )}

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
                {confirmPasswordError && (
                  <p className="text-red-500 text-xs mb-3">{confirmPasswordError}</p>
                )}
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
              <button
                type="submit"
                disabled={hasErrors}
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