
import { Link } from "react-router";

/**
 * Elegant footer inspired by streaming platforms like Netflix or Crunchyroll.
 *
 * @component
 * @returns {JSX.Element} The themed footer for Cinema Space.
 */
export const Footer = () => {
  const hover = "hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200";
  return (
    <footer
      id = "sitemap"
      className="w-full px-6 py-6 bg-gradient-to-b from-blue-600 via-blue-800 to-blue-900 text-white"
      role="contentinfo"
      aria-label="Mapa del sitio"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-col md:flex-col justify-between items-center gap-6">
        <h1 className="text-2xl font-extrabold font-sans white text-shadow">Mapa del sitio</h1>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6 md:gap-12">
          <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-lg font-semibold font-sans mb-2">Videollamadas</h1>
              <Link
                to="/home"
                className={hover}
                aria-label="Ir a la página principal de videollamadas"
                >
                Página principal
              </Link>
          </div>

          <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-lg font-semibold font-sans mb-2">Gestionar cuenta</h1>
            <Link
              to="/sign-in"
              className={hover}
              aria-label="Ir a iniciar sesión"
              >
              Iniciar sesión
            </Link>
            <Link
              to="/sign-up"
              className={hover}
              aria-label="Ir a registrarse"
              >
              Registrarse
            </Link>
            <Link
              to="/recover-password"
              className={hover}
              aria-label="Ir a recuperar contraseña"
              >
              Recuperar contraseña
            </Link>
            <Link
              to="/profile"
              className={hover}
              aria-label="Ir al perfil"
              >
              Perfil
            </Link>
            
          </div>

          <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-lg font-semibold font-sans ">Herramientas</h1>
            <a
              href="/#about-us"
              className={hover}
              aria-label="Ir a la sección sobre nosotros"
              >
              Sobre nosotros
            </a>
            <Link
              to="youtube.com"
              className={hover}
              aria-label="Ir al manual de usuario"
              >
              Manual de usuario
            </Link>
            <Link
              to="/contact"
              className={hover}
              aria-label="Ir a la página de contacto"
              >
              Contacto
            </Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
