import React from "react";

const FacebookLoginButton = ({ isLoading }: { isLoading: boolean }) => {
  const handleFacebookLogin = () => {
    // Implement Facebook login logic here
  };

  return (
    <button
      type="button"
      onClick={handleFacebookLogin}
      disabled={isLoading}
      className="w-full bg-[#E6E6E6] hover:bg-[#CCCCCC] text-xl text-[#1D4ED8] font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      <img src="facebook-logo.png" alt="Logo de Facebook" className="inline-block w-6 h-6 mr-2 align-middle" />
      Ingresar con Facebook
    </button>
  );
};

export default FacebookLoginButton;
