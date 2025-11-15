import { useNavigate } from "react-router";

/**
 * LandingPage Component
 *
 * Displays the main landing section of the Cinema Space application.
 */
export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-16 flex flex-col w-screen justify-center items-center bg-meeting5">
      {/*Seccion inicial*/}  
      <div className="w-full h-screen overflow-y-auto p-5">
        <div
            className="flex gap-10 p-10 items-center justify-center rounded-lg w-full h-full overflow-hidden bg-white shadow-md"
            role="banner"
            aria-label="Pagina inicial de meeting5"
        >
          <div className="flex items-center justify-center w-full h-full text-center">
              <text className="landing-main-text text-left text-black text-5l md:text-5xl font-medium text-shadow-lg">
              Te ayudamos a 
              <span className="main-blue-meeting5 text-shadow-lg"> conectar </span> 
              con tus
              <span className="main-blue-meeting5 text-shadow-lg"> amigos y familiares  </span> 
              a distancia.
              </text>
          </div>

          <div className="flex items-center justify-center w-full h-full">
              <img className="mt-20 rounded-lg w-1/4" src="videollamadas2.jpg" alt="Mujer realizando una videollamada" />
              <img className="rounded-lg w-1/2" src="videollamadas1.jpeg" alt="Hombre mayor realizando una videollamada" />
          </div>

        </div>
      </div>
        {/*Seccion Sobre nosotros*/}
        <div id="about-us" className="flex flex-col justify-center items-center gap-5">
          <div className="flex w-screen h-full justify-center bg-main-blue-meeting5 p-5">
            <h1 className="text-3xl font-semibold text-white text-shadow-lg">Sobre nosotros</h1>
          </div>
          <div className="flex flex-col w-screen justify-center items-center gap-10 p-5">

            <div className="justify-center items-center rounded-lg p-5 bg-white shadow-md">
              <p className="text-lg text-center text-black max-w-4xl">
                Somos un pequeño grupo de 
                <span className="main-blue-meeting5 font-semibold"> 5 desarrolladores </span>
                que decidieron unirse para crear la aplicación de videollamadas mas
                <span className="main-blue-meeting5 font-semibold"> intuitiva y eficiente</span>
                que se haya visto.
              </p>
            </div>

            <div className="flex flex-col gap-4 justify-center items-center rounded-lg p-5 bg-white shadow-md">
              <h1 className="main-blue-meeting5 text-2xl text-center font-bold">Miembros del equipo</h1>
              <div className="flex flex-col gap-4 justify-center items-center">
                <h1 className="main-blue-meeting5 font-semibold">Juan Pablo Pazmiño:
                  <span className="text-black font-normal"> Frontend Developer</span>
                </h1>
                <h1 className="main-blue-meeting5 font-semibold">Daniel Trujillo:
                  <span className="text-black font-normal"> Frontend Dev</span>
                </h1>
                <h1 className="main-blue-meeting5 font-semibold">Samuel Cordoba:
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

            <div className="flex flex-col gap-4 justify-center items-center rounded-lg p-5 bg-white shadow-md">
              <h1 className="main-blue-meeting5 text-2xl text-center font-bold">Nuestra misión</h1>
              <h1 className="text-black text-center font-normal max-w-sm">
                Usar la tecnología para conectar a las personas con sus seres queridos.</h1>
            </div>

            <div className="flex flex-col gap-4 justify-center items-center rounded-lg p-5 bg-white shadow-md">
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
