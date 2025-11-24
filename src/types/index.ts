
/**
 * A participant in a video call or meeting.
 *
 * @property {string} id - Unique identifier for the participant (socket id or user id).
 * @property {string} name - Display name for the participant.
 * @property {boolean} isLocal - True when this participant represents the local user.
 * @property {boolean} audioEnabled - Whether audio is enabled for this participant.
 * @property {boolean} videoEnabled - Whether video is enabled for this participant.
 * @property {string} [avatar] - Optional URL or path to the participant's avatar image.
 */
export interface Participant {
  id: string;
  name: string;
  isLocal: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
  avatar?: string;
}

/**
 * A chat message exchanged in a meeting or room.
 *
 * @property {string} id - Unique id for the message.
 * @property {string} message - The message body.
 * @property {string} sender - Identifier (id or name) of the sender.
 * @property {Date} timestamp - When the message was created.
 */
/*export interface ChatMessage {
  id: string;
  message: string;
  sender: string;
  timestamp: Date;
}*/

export interface ChatMessage {
  id: string;
  meetingId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
}

export interface roomCount {
  meetingId: string;
  socketsCount: number; 
  uniqueUserCount: number;
  socketIds: string[];
  userIds: string[];
}

/**
 * Props passed to a create-meeting UI component.
 *
 * @property {(meetingId: string) => void} onJoinMeeting - Callback invoked when
 *   the user creates or joins a meeting; receives the meeting id.
 */
export interface CreateMeetingProps {
  onJoinMeeting: (meetingId: string) => void;
}

/**
 * Props for a video call room component.
 *
 * @property {() => void} [onLeave] - Optional callback called when the user
 *   leaves the room.
 */
export interface VideoCallRoomProps {
  onLeave?: () => void;
}
