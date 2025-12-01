import { Link } from "react-router";

/**
 * Footer component for the application.
 *
 * Provides quick links (site map) and accessibility attributes. This
 * component is present on most pages and uses semantic `footer` markup.
 *
 * @returns {JSX.Element}
 */
export const Footer = () => {
  const linkClass =
    "hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200";

  return (
    <footer
      id="sitemap"
      className="w-full px-6 py-6 bg-gradient-to-b from-blue-600 via-blue-800 to-blue-900 text-white"
      role="contentinfo"
      aria-label="Mapa del sitio"
    >
      <div className="max-w-7xl mx-auto flex flex-col justify-between items-center gap-6">

        {/* Título principal del footer */}
        <h2 className="text-2xl font-extrabold font-sans">
          Mapa del sitio
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6 md:gap-12">

          {/* Sección 1 */}
          <div className="flex flex-col justify-center items-center gap-2">
            <h3 className="text-lg font-semibold font-sans mb-2">
              Videollamadas
            </h3>

            <Link
              to="/create-meet"
              className={linkClass}
            >
              Página principal
            </Link>
          </div>

          {/* Sección 2 */}
          <div className="flex flex-col justify-center items-center gap-2">
            <h3 className="text-lg font-semibold font-sans mb-2">
              Gestionar cuenta
            </h3>

            <Link to="/sign-in" className={linkClass}>
              Iniciar sesión
            </Link>

            <Link to="/sign-up" className={linkClass}>
              Registrarse
            </Link>

            <Link to="/recover-password" className={linkClass}>
              Recuperar contraseña
            </Link>

            <Link to="/profile" className={linkClass}>
              Perfil
            </Link>
          </div>

          {/* Sección 3 */}
          <div className="flex flex-col justify-center items-center gap-2">
            <h3 className="text-lg font-semibold font-sans mb-2">
              Herramientas
            </h3>

            <a href="/#about-us" className={linkClass}>
              Sobre nosotros
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Manual de usuario
            </a>

            <Link to="/contact" className={linkClass}>
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
