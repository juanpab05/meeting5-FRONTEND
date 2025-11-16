import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage.tsx";
import HomePage from "../pages/HomePage.tsx";
import AboutPage from "../pages/AboutPage.tsx";
import SignUP from "../pages/Sign-up.tsx";
import { RecoverPassword } from "../pages/RecoverPasswordPage.tsx";
import ResetPasswordPage from "../pages/ResetPasswordPage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import { UserProfilePage } from "../pages/UserProfilePage.tsx";
import LayoutMeeting5 from "../layout/LayoutMeeting5.tsx";
import CreateMeetingPage from "../pages/CreateMeetPage.tsx";
/**
 * Top-level route configuration for the CrunchyEISC app.
 *
 * @component
 * @returns {JSX.Element} Router with all application routes inside a shared layout.
 * @remarks
 * - Uses `BrowserRouter` for clean URLs (history API).
 * - Wraps pages with `LayoutCrunchyEISC` to provide global UI (Navbar/Footer).
 */
const RoutesMeeting5 = () => {
  return (
    <BrowserRouter>
      <LayoutMeeting5>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-up" element={<SignUP />} />
          <Route path="/create-meet" element={<CreateMeetingPage />} />
          <Route path="/recover-password" element={<RecoverPassword />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Routes>
      </LayoutMeeting5>
    </BrowserRouter>
  );
};

export default RoutesMeeting5;