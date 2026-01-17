import React, { useState, useRef } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Logo from "../components/Logo";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
    const userNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 
    const [showPassword, setShowPassword] = useState(false);
  
    async function handleSignUp(event) {
        event.preventDefault();
        const enteredName = userNameRef.current.value;
        const enteredEmail = emailRef.current.value;
        const enteredPassword = passwordRef.current.value;
        const enteredConfirmPassword = passwordConfirmRef.current.value;

    // パスワードと確認用パスワードが一致しない場合
        if (enteredPassword !== enteredConfirmPassword) {
            return setErrorMessage("Passwords do not match.");
        }
        try { 
            setErrorMessage("");
            setLoading(true);        
            console.log("before signup");
            await signup(enteredEmail, enteredPassword, enteredName);
            console.log("User signed up successfully!");
            navigate("/profile");
        } catch (err) {
            console.log(err.message);
            setErrorMessage("Failed to sign up");
        }
        setLoading(false);
    } 
  return (
    <div className='form'>
        <Logo />
        <div className="form--wrapper">
            <div className='form--card'>
                <h2 className="form--title">Sign Up</h2>
                <form onSubmit={handleSignUp}>
                    <div> 
                        <label>User Name</label>
                        <input 
                        id="userName"
                        type="text" 
                        ref={userNameRef} 
                        required />
                    </div>
                    <div> 
                        <label>Email</label>
                        <input 
                        id="email" 
                        type="email" 
                        ref={emailRef} 
                        required />
                    </div>
                    <div> 
                        <label>Password</label>
                        <div className="password-field">
                            <input 
                            id="password" 
                            type={showPassword ? "text" : "password"}
                            ref={passwordRef} 
                            required
                            autoComplete="new-password" />
                            <span 
                            className="password-toggle"
                            onClick={() => setShowPassword(prev => !prev)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                        </div>
                    </div>
                    <div>   
                        <label>Password Confirmation</label>
                        <div className="password-field">
                            <input 
                            id="password-confirm" 
                            type={ showPassword ? "text" : "password"}
                            ref={passwordConfirmRef} 
                            required
                            autoComplete="new-password" />
                            <span className="password-toggle"
                            onClick={() => setShowPassword(prev => !prev)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                        </div>
                    </div>
                    <div>
                    </div>
                    {errorMessage && <div className="alert error">{errorMessage}</div>}
                    <button disabled={loading} className="btn btn--primary" type="submit">Sign Up</button>
                </form>
                <div className="form--link">
                <Link to="/login">Already have an account?</Link>
                </div>
            </div>
        </div>
    </div>
  );
}
