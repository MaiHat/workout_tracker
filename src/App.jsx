import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import { AuthProvider } from "./contexts/authContext";
import { WorkoutsContextProvider } from "./contexts/workoutsContext";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./components/ForgotPassword";
import UpdateProfile from "./pages/UpdateProfile";


//import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  return (
    <>
     <AuthProvider>
          <WorkoutsContextProvider>
            <Routes>
              <Route exact path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/update-profile" element={<UpdateProfile />} />
            </Routes>
          </WorkoutsContextProvider>
      </AuthProvider>
    </>
  );
}

export default App;