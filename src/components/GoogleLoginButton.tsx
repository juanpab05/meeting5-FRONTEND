
const GoogleLoginButton = ({ isLoading }: { isLoading: boolean }) => {
  const handleGoogleLogin = () => {
    // Implement Google login logic here
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="w-full bg-[#E6E6E6] hover:bg-[#CCCCCC] text-xl text-[#32A753] font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      <img src="google-logo.png" alt="Logo de Google" className="inline-block w-6 h-6 mr-2 align-middle" />
      Ingresar con Google
    </button>
  );
};

export default GoogleLoginButton;
