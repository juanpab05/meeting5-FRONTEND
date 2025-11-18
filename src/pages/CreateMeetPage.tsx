import { QuickMeeting, JoinMeeting, WelcomeBanner } from "../components/meeting";

interface CreateMeetingPageProps {
    onJoinMeeting?: (meetingId: string) => void;
  }
  
export default function CreateMeetingPage({ onJoinMeeting }: CreateMeetingPageProps) {
  return (
    <div className="min-h-screen bg-[#F5F7FA] p-10">
      <div className="max-w-6xl mx-auto">
        <WelcomeBanner />
        
        <div className="grid md:grid-cols-2 gap-6">
          <QuickMeeting />
          <JoinMeeting onJoinMeeting={onJoinMeeting ?? (() => {})} />
        </div>
      </div>
    </div>
  );
}