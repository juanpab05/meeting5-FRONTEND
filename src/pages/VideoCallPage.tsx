import { VideoCallRoom } from "../components/videoCall/VideoCallRoom";

interface VideoCallPageProps {
  onLeave: () => void;
}

export function VideoCallPage({ onLeave }: VideoCallPageProps) {
  return (
    <div className="bg-gray-900 min-h-screen">
      <VideoCallRoom onLeave={onLeave} />
    </div>
  );
}
