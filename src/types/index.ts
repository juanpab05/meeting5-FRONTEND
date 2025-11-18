
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
  participantId: string;
  participantName: string;
  message: string;
  timestamp: Date;
}

export interface CreateMeetingProps {
  onJoinMeeting: (meetingId: string) => void;
}

export interface VideoCallRoomProps {
  onLeave?: () => void;
}
