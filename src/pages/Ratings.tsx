import { Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { fetchUserStatistics } from "../api/ratings";
import { InterfaceRating } from "../schemas/ratings";
import CardRatings from "../components/CardRating";

export const Ratings: React.FC = () => {
  const [calificaciones, setCalificaciones] = useState<InterfaceRating[]>([]);

  const handleRatings = async () => {
    try {
      const response = await fetchUserStatistics();
        setCalificaciones(response);
    } catch (error) {
      console.log("Error fetching ratings:", error);  
    }
  }

  useEffect(() => {
    handleRatings();
  }, []);

  return(
      <div 
        className="
          flex flex-col pt-24 sm:pt- p-4
          self-start min-h-screen h-full w-full
        "
      >
          {/** === My ratings === */}
          <div className="flex flex-col">
            <p className="flex gap-2 text-4xl items-center">
              <Star className="text-yellow-100 fill-current" aria-hidden="true"/> 
              Mis calificaciones
            </p>
            <span className="text-gray-400 mt-2 mb-4" id="ratings-description">
              Gestiona tus reseñas y calificaciones de peliculas
            </span>
          </div>

          {/** === Stats === */}
          <div className="flex flex-row justify-between items-center gap-4" role="region" aria-labelledby="ratings-description">
              <div className="flex flex-col border border-gray-600 p-4 rounded-md items-center justify-center" aria-label={`Peliculas calificadas: ${calificaciones.length}`}> 
                  {calificaciones.length}
                  <span>Peliculas calificadas</span>
              </div>
              <div className="flex flex-col border border-gray-600 p-4 rounded-md items-center justify-center" aria-label={`Calificacion promedio: ${calificaciones.length > 0 ? (calificaciones.reduce((acc, curr) => acc + curr.rating.rate, 0) / calificaciones.length).toFixed(2) : 0}`}>
                  {calificaciones.length > 0 ?
                    (calificaciones.reduce((acc, curr) => acc + curr.rating.rate, 0) / calificaciones.length).toFixed(2)
                    : 0}
                  <span>Calificacion promedio</span>
              </div>
              <div className="flex flex-col border border-gray-600 p-4 rounded-md items-center justify-center" aria-label={`Con reseña: ${calificaciones.filter(c => c.comment !== null).length}`}>
                  {calificaciones.filter(c => c.comment !== null).length}
                  <span>Con reseña</span>
              </div>
          </div>

          {/** === Ratings === */}
          <section className="flex flex-col gap-6 mt-8" aria-label="Listado de calificaciones de usuario">
              {calificaciones.map((_calificacion, idx) => (
                  <CardRatings key={idx}_calificacion={_calificacion} idx={idx} onDelete={(id) => setCalificaciones((prev) => prev.filter((x) => x.rating._id !== id))}/>
              ))}
          </section>
      </div>
  );
}
