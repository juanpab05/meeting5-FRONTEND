import { useNavigate } from "react-router";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen justify-center items-center bg-gray-500">
        <div
            className="relative w-full h-screen overflow-hidden pb-16 bg-meeting5"
            role="banner"
            aria-label="Landing page de Cinema Space"
        >

        {/* Overlay text layer */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
            <h1 className="text-black text-3xl md:text-5xl font-bold mb-6">
            Te ayudamos a 
            <span className="main-blue-meeting5"> conectar </span> 
            con tus
            <span className="main-blue-meeting5"> amigos y familiares  </span> 
            a distancia.
            </h1>
            <div className="flex gap-8">
            </div>
        </div>
        </div>
    </div>
  );
};

export default LandingPage;