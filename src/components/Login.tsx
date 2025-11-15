import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import { PropsAuth } from "../schemas/auth";

export const Login: React.FC<PropsAuth> = ({auth, setAuth}) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, guestUser, setUser, loadingUser, refreshUser } = useUser();

  useEffect(() => {
      if (auth && !loadingUser && !user?.name) {
        const interval = setInterval(async () => {
        await refreshUser();
        }, 100);
  
        return () => clearInterval(interval);
    }
  }, [auth, user, loadingUser, refreshUser]);

  /** Menu */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
        }
    };
  
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
          setShowMenu(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);
  
    return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  const handleMenu = () => setShowMenu(!showMenu);
  const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(guestUser)
      setAuth(false);
      setShowMenu(false);
      navigate("/home");
  };

  return(
      <div 
        className="flex items-center p-2
        sm:pl-4
        md:pl-22 
        "
      >
        {!auth && (
          <div 
            className="
            flex flex-col gap-2
            sm:flex-row sm:gap-4
            "
          >
            <button
              type="button"
              onClick={() => navigate("/sign-up")}
              className="
              bg-white hover:bg-gray-300 text-black font-semibold 
              px-4 py-2 rounded transition-colors cursor-pointer
              "
            > Registrarse </button>

            <button
              type="button"
              onClick={() => navigate("/sign-in")}
              className="
              bg-red-600 hover:bg-red-700 
              text-white font-semibold 
              px-4 py-2 rounded transition-colors
              cursor-pointer
              "
            > Iniciar sesión </button>
          </div> 
          )
        }

        {auth && localStorage.getItem("token") && ( 
            <div 
              className="
              flex relative gap-4 mt-2 mb-2 w-21 justify-center
              sm:gap-2 md:gap-8 sm:w-auto
              "
            >
                <p 
                className="
                items-center pt-2 hover:text-red-400 duration-200
                hidden sm:block
                "
                >
                    {loadingUser ? "Cargando..." : user?.name}
                </p>
                <button
                type="button"
                onClick={() => handleMenu()}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors"
                >
                { user?.profilePicture && user?.profilePicture?.profilePictureURL && localStorage.getItem("token") ? (
                    <img 
                        className ="h-10 w-10 rounded cursor-pointer"
                        src ={user?.profilePicture.profilePictureURL}
                    /> 
                ) : (
                    <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
                )}
                </button>

                {showMenu && (
                <div 
                    ref={menuRef}
                    className="absolute right-0 mt-12 mr-4 bg-white text-black rounded shadow-lg p-2">
                    <p 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                        navigate("/profile")
                    }}
                    >
                        Configuración</p>
                    <p
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                        handleLogout()
                    }}
                    >
                    Cerrar sesión
                    </p>
                </div>
                )}
            </div>  
          )
        }
      </div>
  );
};

export default Login;