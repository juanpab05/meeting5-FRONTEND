import { Video, Users, Shield, Zap } from "lucide-react";

export function WelcomeBanner() {
  const features = [
    {
      icon: Video,
      title: "HD Quality",
      description: "Videollamadas en alta definición"
    },
    {
      icon: Users,
      title: "Sin límites",
      description: "Conecta con tu equipo sin restricciones"
    },
    {
      icon: Shield,
      title: "Seguro",
      description: "Encriptación end-to-end"
    },
    {
      icon: Zap,
      title: "Instantáneo",
      description: "Crea reuniones en segundos"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-2xl p-8 md:p-12 mb-8 shadow-lg">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#60A5FA] rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#60A5FA] rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse"></div>
            <span className="text-white text-sm">Disponible ahora</span>
          </div>
          
          <h2 className="text-white mb-4">
            Conecta con tu equipo desde cualquier lugar
          </h2>
          
          <p className="text-white/90 text-lg mb-8 max-w-2xl">
            Experiencia de videollamadas profesional con calidad superior. 
            Comparte tu pantalla, chatea en tiempo real y colabora sin fricciones.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300"
                >
                  <Icon className="w-6 h-6 text-[#60A5FA] mb-2" />
                  <h3 className="text-white text-sm mb-1">{feature.title}</h3>
                  <p className="text-white/70 text-xs leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
