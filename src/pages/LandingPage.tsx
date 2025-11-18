import { useNavigate } from "react-router";

/**
 * LandingPage Component
 *
 */
export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-16 flex flex-col w-full justify-center items-center bg-meeting5 overflow-x-hidden">
      {/*Seccion inicial*/}  
      <div className="flex w-full h-screen justify-center items-center p-8">
        <div
            className="flex flex-col lg:flex-row p-5 lg:px-15 lg:py-10 items-center justify-center rounded-lg w-full h-full shadow-md
              bg-gradient-to-b
              from-white
              via-slate-50
              to-slate-100"
            role="banner"
            aria-label="Pagina inicial de meeting5"
        >
            <div className="flex items-center justify-center w-full lg:w-1/2 h-full min-w-0">
              <p className="landing-main-text text-center text-black text-5l lg:text-5xl font-normal break-words">
              Te ayudamos a 
              <span className="main-blue-meeting5 font-medium"> conectar </span> 
              con tus
              <span className="main-blue-meeting5 font-medium"> amigos y familiares  </span> 
              a distancia.
              </p>
          </div>

            <div className="flex items-center justify-center lg:justify-end w-full h-full flex-wrap min-w-0">
              <img className="lg:mt-20 rounded-lg w-50 lg:w-60 max-w-full shadow-lg" src="videollamadas2.jpg" alt="Mujer realizando una videollamada" />
              <img className="lg:mb-20 rounded-lg w-100 lg:w-120 max-w-full shadow-lg" src="videollamadas1.jpeg" alt="Hombre mayor realizando una videollamada" />
          </div>

        </div>
      </div>
      
        {/*Seccion Sobre nosotros*/}
        <div id="about-us" className="flex flex-col justify-center items-center h-full w-full md:w-3/4 lg:w-1/2 pb-8 px-8 gap-8">
          <div className="flex w-screen h-full justify-center bg-main-blue-meeting5 p-5">
            <h1 className="text-3xl font-semibold text-white text-shadow-lg">Sobre nosotros</h1>
          </div>

          <div className="flex flex-col w-full justify-center items-center rounded-lg shadow-md gap-10 p-5 min-w-0
              bg-gradient-to-b
              from-white
              via-slate-50
              to-slate-100">
            
            <div className="justify-center items-center p-5">
              <p className="text-lg text-center text-black max-w-4xl">
                Somos un pequeño grupo de 
                <span className="main-blue-meeting5 font-semibold"> 5 desarrolladores </span>
                que decidieron unirse para crear la aplicación de videollamadas mas
                <span className="main-blue-meeting5 font-semibold"> intuitiva y eficiente </span>
                que se haya visto.
              </p>
            </div>

            <div className="flex flex-col gap-4 justify-center items-center rounded-lg p-5">
              <h1 className="main-blue-meeting5 text-2xl text-center font-bold">Miembros del equipo</h1>
              <div className="flex flex-col gap-4 justify-center items-center">
                <h1 className="main-blue-meeting5 font-semibold">Juan Pablo Pazmiño:
                  <span className="text-black font-normal"> Frontend Developer</span>
                </h1>
                <h1 className="main-blue-meeting5 font-semibold">Daniel Trujillo:
                  <span className="text-black font-normal"> Frontend Dev</span>
                </h1>
                <h1 className="main-blue-meeting5 font-semibold">Esteban Cordoba:
                  <span className="text-black font-normal"> Frontend Developer</span>
                </h1>
                <h1 className="main-blue-meeting5 font-semibold">Juan Sebastian:
                  <span className="text-black font-normal"> Backend Developer</span>
                </h1>
                <h1 className="main-blue-meeting5 font-semibold">James Calero:
                  <span className="text-black font-normal"> Backend Dev, scrum master</span>
                </h1>
              </div>

            </div>

            <div className="flex flex-col gap-4 justify-center items-center rounded-lg p-5">
              <h1 className="main-blue-meeting5 text-2xl text-center font-bold">Nuestra misión</h1>
              <h1 className="text-black text-center font-normal max-w-sm">
                Usar la tecnología para conectar a las personas con sus seres queridos.</h1>
            </div>

            <div className="flex flex-col gap-4 justify-center items-center rounded-lg p-5">
              <h1 className="main-blue-meeting5 text-2xl text-center font-bold">Nuestra visión</h1>
              <h1 className="text-black text-center font-normal max-w-sm">
                Convertir a esta página en la alternativa para videollamadas mas exitosa.</h1>
            </div>
         

          </div>
        </div>
    </div>
  );
};

export default LandingPage;
