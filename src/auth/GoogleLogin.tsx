import { useEffect } from "react";

// Extiende el tipo de `window` para incluir la propiedad `google`
declare global {
  interface Window {
    google: any; // Agrega google al tipo global de window
  }
}

const GoogleLogin = () => {
  useEffect(() => {
    if (!window.google) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID", // Tu client_id de Google
      callback: handleGoogleCallback,
    });

    window.google.accounts.id.prompt(); // Inicia la verificación de login
  }, []);

  const handleGoogleCallback = (response: any) => {
    const { credential } = response;
    fetchGoogleUserData(credential);
  };

  const fetchGoogleUserData = (token: string) => {
    fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos del usuario de Google:", data);
        // Almacena los datos en localStorage o en tu estado global
      })
      .catch((error) => console.error("Error obteniendo datos de Google:", error));
  };

  return (
    <button
      type="button"
      onClick={() => window.google.accounts.id.prompt()}
      className="w-full bg-[#E6E6E6] hover:bg-[#CCCCCC] text-xl text-[#32A753] font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      <img
        src="google-logo.png"
        alt="Logo de Google"
        className="inline-block w-6 h-6 mr-2 align-middle"
      />
      Iniciar sesión con Google
    </button>
  );
};

export default GoogleLogin;
