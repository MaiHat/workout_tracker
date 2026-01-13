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
        <div className="header--right">
          <Link to="/account-profile" >Account</Link>
          <Logout />
         </div>
      </div>
    </div>
  )
}
