import { useNavigate } from "react-router";
import Navbar from "./Navbar";
import CinemaLogo from "./CinemaLogo";
import { useEffect, useRef, useState } from "react";
import { fetchUserProfile } from "../api/user";
import { UserData } from "../schemas/user";

type Props = {
  isAuth: boolean;
  setIsAuth: (bool: boolean) => void;
  refreshKey: number;
};

export const Header: React.FC<Props> = ({ isAuth, setIsAuth, refreshKey }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState<UserData>({
    name: "",
    surname: "",
    age: 0,
    email: "",
    password: "",
    profilePicture: { profilePictureURL: "", profilePictureID: "" },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const menuRef = useRef<HTMLDivElement>(null);

  /** Alternar menú */
  const handleMenu = () => setShowMenu((prev) => !prev);

  /** Cerrar sesión */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuth(false);
    setShowMenu(false);
    navigate("/home");
  };

  /** Cerrar menú al hacer clic fuera o presionar ESC */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  /** Cargar datos de usuario */
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await fetchUserProfile();
        if (response?.data) {
          setUser(response.data);
          setUserName(response.data.name || "");
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      }
    };

    if (isAuth) {
      loadUserData();
    } else {
      setUser({
        name: "",
        surname: "",
        age: 0,
        email: "",
        password: "",
        profilePicture: { profilePictureURL: "", profilePictureID: "" },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setUserName("");
    }
  }, [isAuth, refreshKey]);

  return (
    <header
      className="
        fixed top-0 left-0 w-full bg-black text-white shadow-md border-b border-gray-800 z-50
        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-8 px-4 py-3
      "
      role="banner"
      aria-label="Encabezado de Cinema Space"
    >
      {/* LOGO */}
      <div className="flex justify-between items-center w-full gap-20">
        <div className="flex items-center gap-2">
          <CinemaLogo size="sm" />
          <span className="text-lg font-semibold">Cinema Space</span>
        </div>
      </div>

      {/* NAVBAR */}
      <div className="flex justify-center flex-1">
        <Navbar isAuth={isAuth} />
      </div>

      {/* PERFIL / LOGIN */}
      <div className="flex w-full items-center justify-end">
        {!isAuth ? (
          <div className="flex gap-8">
            <button
              type="button"
              className="bg-white hover:bg-gray-300 text-black font-semibold px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={() => navigate("/sign-up")}
              aria-label="Registrarse en Cinema Space"
            >
              Registrarse
            </button>

            <button
              type="button"
              onClick={() => navigate("/sign-in")}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Iniciar sesión en Cinema Space"
            >
              Iniciar sesión
            </button>
          </div>
        ) : (
          <div className="flex relative gap-8 pr-6 items-center">
            <p className="pt-2">{userName}</p>

            <button
              type="button"
              onClick={handleMenu}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Abrir menú de usuario"
              aria-expanded={showMenu}
              aria-controls="user-menu"
            >
              {user?.profilePicture?.profilePictureURL ? (
                <img
                  className="h-12 w-12 rounded"
                  src={user.profilePicture.profilePictureURL}
                  alt="Foto de perfil del usuario"
                />
              ) : (
                <div className="h-10 w-10 bg-gray-300 rounded" aria-hidden="true" />
              )}
            </button>

            {showMenu && (
              <div
                ref={menuRef}
                id="user-menu"
                className="absolute right-0 mt-12 mr-4 bg-white text-black rounded shadow-lg p-2"
                role="menu"
                aria-label="Menú de usuario"
              >
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer focus:bg-gray-200 focus:outline-none"
                  onClick={() => navigate("/profile")}
                  role="menuitem"
                >
                  Configuración
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer focus:bg-gray-200 focus:outline-none"
                  onClick={handleLogout}
                  role="menuitem"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
