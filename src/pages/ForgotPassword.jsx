import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Logo from "../components/Logo";


export default function ForgotPassword() {
  const emailRef = useRef();
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  
  async function handleSubmit(e) {
    e.preventDefault();
    const enteredEmail = emailRef.current.value;
    try {
      await resetPassword(enteredEmail);
    } catch(err) {
      console.log(err.message);
      setErrorMessage("Failed to reset password");
    }
     setLoading(false);
    }

  return (
    <div className="form">
      <Logo />
      <div className="form--wrapper">
        <div className="form--card">
          <h2 className="form--title">Password Reset</h2>
          <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input id="email" type="email" ref={emailRef} required />
          </div>
          <button disabled={loading} className="btn btn--primary" type="submit">
            Reset Password
          </button>
        </form>
        <div className="form--link">
          <Link to="/login">LOG IN</Link>
        </div>
        <div className="form--link">
          <Link to="/SignupTest">Do not have account yet?</Link>
        </div>
      </div>
    </div>
    </div>
  )
}



