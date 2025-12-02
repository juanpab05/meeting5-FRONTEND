
import type { Participant } from "../../types";
import { VideoTile } from "./VideoTile";

interface VideoGridProps {
  participants: (Participant & { stream?: MediaStream })[];
}

export function VideoGrid({ participants }: VideoGridProps) {
  const getGridClass = () => {
    const count = participants.length;
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2 grid-rows-2";
    if (count <= 6) return "grid-cols-3 grid-rows-2";
    return "grid-cols-3 grid-rows-3";
  };

  const gridClass = getGridClass();
  const isMultiRow = gridClass.includes("grid-rows-");

  return (
    <div
      className={`h-full grid gap-4 ${gridClass}`}
      role="list"
      aria-label="Grid de videos de participantes"
      aria-rowcount={isMultiRow ? Number(gridClass.match(/grid-rows-(\d+)/)?.[1]) : undefined}
      aria-colcount={Number(gridClass.match(/grid-cols-(\d+)/)?.[1])}
    >
      {participants.map((participant) => (
        <div 
            key={participant.id} // La key del contenedor es el ID
            role="listitem" 
            aria-label={`Video de ${participant.name}`}
        >
          <VideoTile 
            key={participant.stream?.id || `no-stream-${participant.id}`} 
            participant={participant} 
          />
        </div>
      ))}
    </div>
  );
}
