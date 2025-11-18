import type { Participant } from "../../types";
import { VideoTile } from "./VideoTile";

interface VideoGridProps {
  participants: Participant[];
  isScreenSharing: boolean;
}

export function VideoGrid({ participants, isScreenSharing }: VideoGridProps) {
  const getGridClass = () => {
    const count = participants.length;
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2 grid-rows-2";
    if (count <= 6) return "grid-cols-3 grid-rows-2";
    return "grid-cols-3 grid-rows-3";
  };

  if (isScreenSharing) {
    return (
      <div className="h-full flex gap-4">
        {/* Screen Share - Main View */}
        <div className="flex-1 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-white">Compartiendo pantalla</p>
          </div>
        </div>

        {/* Participants Sidebar */}
        <div className="w-64 flex flex-col gap-2 overflow-y-auto">
          {participants.map((participant) => (
            <div key={participant.id} className="h-36 flex-shrink-0">
              <VideoTile participant={participant} compact />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full grid gap-4 ${getGridClass()}`}>
      {participants.map((participant) => (
        <VideoTile key={participant.id} participant={participant} />
      ))}
    </div>
  );
}