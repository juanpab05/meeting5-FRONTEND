import { Link } from "react-router";

export const FooterNavbar: React.FC<{ isAuth?: boolean }> = ({ isAuth }) => {
  const hover = "hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200";

  return (
    <nav
      className="flex flex-col justify-center items-center text-sm"
      role="navigation"
      aria-label="Mapa del sitio"
    >
      <p className="font-semibold text-gray-400 uppercase tracking-wide">
        Mapa del Sitio
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-6 mt-2">
        <Link
          to="/home"
          className={hover}
          aria-label="Ir a la página de inicio"
        >
          Inicio
        </Link>

        {!isAuth && (
          <>
            <Link
              to="/sign-in"
              className={hover}
              aria-label="Ir a la página de iniciar sesión"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/sign-up"
              className={hover}
              aria-label="Ir a la página de crear cuenta"
            >
              Crear cuenta
            </Link>
          </>
        )}

        {isAuth && (
          <>
            <Link
              to="/favorites"
              className={hover}
              aria-label="Ir a la página de favoritos"
            >
              Favoritos
            </Link>

            <Link
              to="/ratings"
              className={hover}
              aria-label="Ir a la página de categorías"
            >
              Categorías
            </Link>
          </>
        )}

        <Link
          to="/recover-password"
          className={hover}
          aria-label="Ir a la página de recuperar contraseña"
        >
          Recuperar contraseña
        </Link>
        <Link
          to="/about-us"
          className={hover}
          aria-label="Ir a la página sobre nosotros"
        >
          Sobre nosotros
        </Link>
      </div>
    </nav>
  );
};

export default FooterNavbar;