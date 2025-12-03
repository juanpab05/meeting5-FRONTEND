/**
 * LandingPage Component
 *
 */
export const LandingPage: React.FC = () => {

  return (
    <div className="mt-16 flex flex-col w-full justify-center items-center bg-meeting5 overflow-x-hidden">

      {/* Sección inicial */}
      <header 
        className="flex w-full h-screen justify-center items-center p-8"
        aria-label="Sección introductoria de la aplicación Meeting5"
      >
        <div
          className="flex flex-col lg:flex-row p-5 lg:px-15 lg:py-10 items-center justify-center rounded-lg w-full h-full shadow-md
            bg-gradient-to-b
            from-white
            via-slate-50
            to-slate-100"
        >
          {/* Texto principal */}
          <div className="flex items-center justify-center w-full lg:w-1/2 h-full min-w-0">
            <h1 className="landing-main-text text-center text-black text-5l lg:text-5xl font-normal break-words">
              Te ayudamos a
              <span className="main-blue-meeting5 font-medium"> conectar </span>
              con tus
              <span className="main-blue-meeting5 font-medium"> amigos y familiares </span>
              a distancia.
            </h1>
          </div>

          {/* Imágenes intro */}
          <div className="flex items-center justify-center lg:justify-end w-full h-full flex-wrap min-w-0">
            <img
              className="lg:mt-20 rounded-lg w-50 lg:w-60 max-w-full shadow-lg"
              src="videollamadas2.jpg"
              alt="Mujer realizando una videollamada"
            />
            <img
              className="lg:mb-20 rounded-lg w-100 lg:w-120 max-w-full shadow-lg"
              src="videollamadas1.jpeg"
              alt="Hombre mayor realizando una videollamada"
            />
          </div>
        </div>
      </header>
      
      {/* Sección Sobre nosotros */}
      <section
        id="about-us"
        className="flex flex-col justify-center items-center h-full w-full md:w-3/4 lg:w-1/2 pb-8 px-8 gap-8"
        aria-labelledby="about-us-title"
      >
        <div className="flex w-screen h-full justify-center bg-main-blue-meeting5 p-5">
          <h2
            id="about-us-title"
            className="text-3xl font-semibold text-white text-shadow-lg"
          >
            Sobre nosotros
          </h2>
        </div>

        <div
          className="flex flex-col w-full justify-center items-center rounded-lg shadow-md gap-10 p-5 min-w-0
            bg-gradient-to-b
            from-white
            via-slate-50
            to-slate-100"
        >
          <div className="justify-center items-center p-5">
            <p className="text-lg text-center text-black max-w-4xl">
              Somos un pequeño grupo de
              <span className="main-blue-meeting5 font-semibold"> 5 desarrolladores </span>
              que decidieron unirse para crear la aplicación de videollamadas más
              <span className="main-blue-meeting5 font-semibold"> intuitiva y eficiente </span>
              que se haya visto.
            </p>
          </div>

          {/* Miembros del equipo */}
          <section
            className="flex flex-col gap-4 justify-center items-center rounded-lg p-5"
            aria-labelledby="team-title"
          >
            <h3
              id="team-title"
              className="main-blue-meeting5 text-2xl text-center font-bold"
            >
              Miembros del equipo
            </h3>

          <div className="flex flex-col gap-6 justify-center items-center">
            <div className="flex flex-col items-center text-center">
              <p className="main-blue-meeting5 font-semibold">Juan Pablo Pazmiño</p>
              <p className="text-black font-normal text-sm">Frontend Developer</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <p className="main-blue-meeting5 font-semibold">Daniel Trujillo</p>
              <p className="text-black font-normal text-sm">Frontend Dev</p>
            </div>

            <div className="flex flex-col items-center text-center">
             <p className="main-blue-meeting5 font-semibold">Esteban Cordoba</p>
             <p className="text-black font-normal text-sm">Frontend Developer</p>
            </div>

            <div className="flex flex-col items-center text-center">
             <p className="main-blue-meeting5 font-semibold">Juan Sebastian</p>
             <p className="text-black font-normal text-sm">Backend Developer</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <p className="main-blue-meeting5 font-semibold">James Calero</p>
              <p className="text-black font-normal text-sm">Backend Dev, Scrum Master</p>
            </div>
          </div>

          </section>

          {/* Misión */}
          <section
            className="flex flex-col gap-4 justify-center items-center rounded-lg p-5"
            aria-labelledby="mission-title"
          >
            <h3
              id="mission-title"
              className="main-blue-meeting5 text-2xl text-center font-bold"
            >
              Nuestra misión
            </h3>
            <p className="text-black text-center font-normal max-w-sm">
              Usar la tecnología para conectar a las personas con sus seres queridos.
            </p>
          </section>

          {/* Visión */}
          <section
            className="flex flex-col gap-4 justify-center items-center rounded-lg p-5"
            aria-labelledby="vision-title"
          >
            <h3
              id="vision-title"
              className="main-blue-meeting5 text-2xl text-center font-bold"
            >
              Nuestra visión
            </h3>
            <p className="text-black text-center font-normal max-w-sm">
              Convertir esta página en la alternativa para videollamadas más exitosa.
            </p>
          </section>

        </div>
      </section>
    </div>
  );
};

export default LandingPage;
