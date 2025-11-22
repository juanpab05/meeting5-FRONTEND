import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import SignUP from "../pages/Sign-up";
import { RecoverPassword } from "../pages/RecoverPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import LoginPage from "../pages/LoginPage";
import { UserProfilePage } from "../pages/UserProfilePage";
import LayoutMeeting5 from "../layout/LayoutMeeting5";
import CreateMeetingPage from "../pages/CreateMeetPage";
import { VideoCallPage } from "../pages/VideoCallPage";

/**
 * Router component for the Meeting5 application.
 *
 * Defines all the app routes and wraps them in the main layout.
 * @returns {JSX.Element}
 */

const RoutesMeeting5 = () => {
  return (
    <LayoutMeeting5>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-up" element={<SignUP />} />
        <Route path="/create-meet" element={<CreateMeetingPage />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/meeting/:id" element={<VideoCallPage />} />
      </Routes>
    </LayoutMeeting5>
  );
};

export default RoutesMeeting5;
