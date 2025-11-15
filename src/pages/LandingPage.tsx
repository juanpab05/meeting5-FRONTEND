import { useNavigate } from "react-router";

/**
 * LandingPage Component
 *
 * Displays the main landing section of the Cinema Space application.
 */
export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateHome = (): void => {
    navigate("/home");
  };

  const handleGuide = (): void => {
    // Open external Drive link in a new tab safely
    const url = "https://drive.google.com/file/d/1BjcIdARCBlUkpD_7rrHTzVk3ssvy6z9i/view?usp=sharing";
    // use window.open to navigate to external URLs (do not use react-router navigate for external links)
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (  
    <div className="flex flex-col w-screen h-screen justify-center items-center bg-meeting5 p-5">
        <div
            className="rounded-lg flex w-auto h-full overflow-hidden p-10 bg-white shadow-md"
            role="banner"
            aria-label="Pagina inicial de meeting5"
        >
          <div className="flex gap-4 items-center justify-center w-full h-full text-center px-6">
              <text className="landing-main-text text-left text-black text-5l md:text-5xl font-medium text-shadow-lg">
              Te ayudamos a 
              <span className="main-blue-meeting5 text-shadow-lg"> conectar </span> 
              con tus
              <span className="main-blue-meeting5 text-shadow-lg"> amigos y familiares  </span> 
              a distancia.
              </text>
          </div>
          <div className="flex items-center justify-center w-full h-full">
              <img className="rounded-lg w-0" src="videollamadas2.jpg" alt="Mujer realizando una videollamada" />
              <img className="rounded-lg w-full" src="videollamadas1.jpeg" alt="Hombre mayor realizando una videollamada" />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-6">
          <div className="flex w-screen h-full justify-center bg-main-blue-meeting5 gap-4 p-5">
            <h1 className="text-3xl font-semibold text-white text-shadow-lg">Sobre nosotros</h1>
          </div>
          <div className="flex flex-col w-screen justify-center items-center gap-5 p-5">
            <div className="justify-center items-center rounded-lg p-5 bg-white shadow-md">
              <p className="text-lg text-center text-black max-w-4xl">
                Somos un pequeño grupo de 
                <span className="main-blue-meeting5 font-semibold"> 5 desarrolladores </span>
                que decidieron unirse para crear la aplicación de videollamadas mas
                <span className="main-blue-meeting5 font-semibold"> intuitiva y eficiente</span>
                que se haya visto.
              </p>
            </div>
          </div>
        </div>
    </div>
  );
};

export default LandingPage;
