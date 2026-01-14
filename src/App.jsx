import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import { AuthProvider } from "./contexts/authContext";
import { WorkoutsContextProvider } from "./contexts/workoutsContext";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import AccountProfile from "./pages/AccountProfile";


//import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  return (
    <>
    <HashRouter>
     <AuthProvider>
          <WorkoutsContextProvider>
            <Routes>
              <Route exact path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/account-profile" element={<AccountProfile />} />
            </Routes>
          </WorkoutsContextProvider>
      </AuthProvider>
    </HashRouter>
    </>
  );
}

export default App;