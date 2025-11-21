import React from 'react';
import Logo from "./Logo";
import Logout from "./Logout";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function Header() {
  const { currentUser, username } = useAuth();
  return (
    <div className='header'>
        <div className='header--wrapper'>
          <div className='header--left'>
            <Logo />
          </div>
          <div className="header-right">
            <Logout />
            <Link to="/update-profile" >Update Profile</Link>
          </div>
          <div className="greeting">
            <h1>Hello  {username}</h1>
            <h2>Email: {currentUser.email}</h2>
          </div>
        </div>
      
    </div>
  )
}
