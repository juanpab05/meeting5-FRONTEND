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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormulario({ ...formulario, [name]: value });

    if (name === "password") {
      const error = validatePassword(value);
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
      } else if (error.message.includes("Email is already registered")) {
        setErrorMessage("El correo electrónico ya está registrado.");
      } else {
        setErrorMessage("No se pudo registrar el usuario.");
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-meeting5 flex items-center justify-center p-6">
      <div className="w-full md:w-full lg:w-1/2 xl:w-1/3 flex flex-col max-w-md md:max-w-lg lg:max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">

        <div className="w-full items-center justify-center p-8 md:p-12 lg:px-16 lg:py-12">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => navigate("/")}
              aria-label="Ir a la página de inicio"
              className="cursor-pointer"
            >
              <img
                src="logo.svg"
                className="w-28 rounded-xl"
                alt="Logo de Meeting5, aplicación de videollamadas"
              />
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-black text-3xl lg:text-4xl font-bold">Crear una cuenta</h1>
          </div>

          {/* Registration form */}
          <form
            onSubmit={handleSubmit}
            method="POST"
            className="grid grid-cols-1 gap-4 w-full"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col w-full gap-2">

                {/* First Name */}
                <label htmlFor="firstName" className="font-semibold text-sm text-black">
                  Nombres
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formulario.firstName}
                  placeholder="Ingresa tus nombres"
                  required
                  aria-required="true"
                  aria-invalid={formulario.firstName === "" ? "true" : "false"}
                  className="rounded-lg h-10 border border-gray-400 p-2 text-sm text-black"
                  onChange={handleChange}
                />

                {/* Last Name */}
                <label htmlFor="lastName" className="font-semibold text-sm text-black">
                  Apellidos
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formulario.lastName}
                  placeholder="Ingresa tus apellidos"
                  required
                  aria-required="true"
                  aria-invalid={formulario.lastName === "" ? "true" : "false"}
                  className="rounded-lg h-10 border border-gray-400 p-2 text-sm text-black"
                  onChange={handleChange}
                />

                {/* Age */}
                <label htmlFor="age" className="font-semibold text-sm text-black">
                  Edad
                </label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  value={age}
                  placeholder="Ingresa tu edad"
                  required
                  aria-required="true"
                  aria-invalid={!!ageError}
                  aria-describedby={ageError ? "age-error" : undefined}
                  className="rounded-lg h-10 border border-gray-400 p-2 text-sm text-black"
                  onChange={handleAgeChange}
                />
                {ageError && (
                  <p id="age-error" className="text-red-500 text-xs" role="alert">
                    {ageError}
                  </p>
                )}

                {/* Email */}
                <label htmlFor="email" className="font-semibold text-sm text-black">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formulario.email}
                  placeholder="Ejemplo: usuario@gmail.com"
                  required
                  aria-required="true"
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  className="rounded-lg h-10 border border-gray-400 p-2 text-sm text-black"
                  onChange={handleChange}
                />
                {emailError && (
                  <p id="email-error" className="text-red-500 text-xs" role="alert">
                    {emailError}
                  </p>
                )}

                {/* Password */}
                <label htmlFor="password" className="font-semibold text-sm text-black">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formulario.password}
                  placeholder="Mínimo 8 caracteres, mayúscula, número y símbolo"
                  required
                  aria-required="true"
                  aria-invalid={!!passwordError}
                  aria-describedby={passwordError ? "password-error" : undefined}
                  className="rounded-lg h-10 border border-gray-400 p-2 text-sm text-black"
                  onChange={handleChange}
                />
                {passwordError && (
                  <p id="password-error" className="text-red-500 text-xs" role="alert">
                    {passwordError}
                  </p>
                )}

                {/* Confirm Password */}
                <label htmlFor="confirmPassword" className="font-semibold text-sm text-black">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formulario.confirmPassword}
                  placeholder="Vuelve a ingresar la contraseña"
                  required
                  aria-required="true"
                  aria-invalid={!!confirmPasswordError}
                  aria-describedby={confirmPasswordError ? "confirmPassword-error" : undefined}
                  className="rounded-lg h-10 border border-gray-400 p-2 text-sm text-black"
                  onChange={handleChange}
                />
                {confirmPasswordError && (
                  <p id="confirmPassword-error" className="text-red-500 text-xs" role="alert">
                    {confirmPasswordError}
                  </p>
                )}
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
              <button
                type="submit"
                disabled={hasErrors}
                className="w-full bg-blue-700 hover:bg-blue-800 text-xl text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="flex flex-wrap justify-center gap-2 mt-6 mb-10 text-sm text-gray-600">
            <button
              onClick={() => navigate("/sign-in")}
              className="hover:text-blue-500 transition-colors"
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
