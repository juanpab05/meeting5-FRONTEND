
export interface Participant {
  id: string;
  name: string;
  isLocal: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: string;
  timestamp: Date;
}

export interface CreateMeetingProps {
  onJoinMeeting: (meetingId: string) => void;
}

export interface VideoCallRoomProps {
  onLeave?: () => void;
}
