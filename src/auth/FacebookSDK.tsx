import { useEffect } from "react";

declare global {
  interface Window {
    FB: any; // Aseguramos que Facebook esté disponible en el objeto window
  }
}

const FacebookSDK = () => {
  useEffect(() => {
    if (typeof window.FB !== "undefined") {
      window.FB.init({
        appId: "26182124374710919", // Tu appId de Facebook
        cookie: true,
        xfbml: true,
        version: "v12.0", // Usa la versión del SDK que prefieras
      });
    } else {
      // Si no está definido FB, cargamos el SDK de forma dinámica
      (function (d, s, id) {
        const js = d.createElement(s) as HTMLScriptElement;  // Forzamos el tipo a HTMLScriptElement
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode?.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    }
  }, []);

  const handleFacebookLogin = () => {
    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          console.log("Logged in with Facebook:", response);
          // Procesa los datos del usuario aquí, p.ej., obtener el token
        } else {
          console.error("Error de autenticación en Facebook");
        }
      },
      { scope: "public_profile,email" } // Permisos que necesitamos
    );
  };

  return (
    <button
      type="button"
      onClick={handleFacebookLogin}
      className="w-full bg-[#E6E6E6] hover:bg-[#CCCCCC] text-xl text-[#1D4ED8] font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      <img
        src="facebook-logo.png"
        alt="Logo de Facebook"
        className="inline-block w-6 h-6 mr-2 align-middle"
      />
      Iniciar sesión con Facebook
    </button>
  );
};

export default FacebookSDK;
