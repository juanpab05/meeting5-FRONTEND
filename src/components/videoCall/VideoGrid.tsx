// components/videoCall/VideoGrid.tsx
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

  return (
    <div className={`h-full grid gap-4 ${getGridClass()}`}>
      {participants.map((participant) => (
        <VideoTile key={participant.id} participant={participant} />
      ))}
    </div>
  );
}
