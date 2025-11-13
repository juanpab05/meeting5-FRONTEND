import { BrowserRouter, Routes, Route } from "react-router";
import LandingPage from "../pages/LandingPage.tsx";
//import HomePage from "../pages/HomePage.tsx";
//import LoginPage from "../pages/LoginPage.tsx";
//import SignUP from "../pages/Sign-up.tsx";
//import RecoverPassword from "../pages/RecoverPasswordPage.tsx";
//import ResetPasswordPage from "../pages/ResetPasswordPage.tsx";

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
        <Routes>
          <Route path="/" element={<LandingPage/>} />
        </Routes>
    </BrowserRouter>
  );
};

export default RoutesMeeting5;