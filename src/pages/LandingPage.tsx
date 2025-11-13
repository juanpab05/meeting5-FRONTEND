import { useNavigate } from "react-router";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-screen overflow-hidden pb-16"
      role="banner"
      aria-label="Landing page de Cinema Space"
    >
      {/* Background image */}
      <img
        src="/image-landing.jpg"
        alt="Fondo con temática de películas y anime"
        className="absolute top-0 left-0 w-full h-full object-cover brightness-75"
      />

      {/* Overlay text layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Únete a <span className="text-red-500">Cinema Space</span> y descubre miles de películas
        </h1>
        <div className="flex gap-8">
        </div>
      </div>
    </div>
  );
};

export default LandingPage;