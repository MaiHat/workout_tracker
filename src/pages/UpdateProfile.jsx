import React,{ useState, useRef } from 'react'
import { Form,  Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Logo from "../components/Logo";

export default function UpdateProfile() {
    const userNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { currentUser, username, changeEmail, changePassword } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 
  

    async function handleSubmit(event) {
        event.preventDefault();
        const enteredName = userNameRef.current.value;
        const enteredEmail = emailRef.current.value;
        const enteredPassword = passwordRef.current.value;
        const enteredConfirmPassword = passwordConfirmRef.current.value;

    // パスワードと確認用パスワードが一致しない場合
        if (enteredPassword !== enteredConfirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }
    try { 
        setErrorMessage("");
        setLoading(true);        
        //await signup(enteredEmail, enteredPassword);
       console.log("User signed up successfully!");
       navigate("/profile");
        } catch (err) {
        console.log(err.message);
        setErrorMessage("Failed to sign up");
        }
        setLoading(false);
    } 

    return (
        <div className="form">
            <Logo />
            <div className='form--wrapper'>
                <div className='form--card'>
                    <h2 className="form--title">Update Profile</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>New User Name</label>
                            <input
                            id="username"
                            type="text" 
                            ref={userNameRef} 
                            required 
                            defaultValue={username}/>
                        </div>
                        <div>
                            <label>New Email</label>
                            <input 
                            type="email" 
                            id="email"
                            ref={emailRef} 
                            required 
                            defaultValue={currentUser.email} />
                        </div>
                        <div>
                            <label>New Password</label>
                            <input
                            type="password" 
                            id="password"
                            ref={passwordRef} 
                            placeholder="Leave blank to keep the same" />
                        </div>
                        <div>
                            <label>Password Confirmation</label>
                            <input 
                            type="password" 
                            id="password-confirm"
                            ref={passwordConfirmRef} 
                            placeholder="Leave blank to keep the same" />
                        </div>
                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                        <button disabled={loading} className="btn btn--primary" type="submit">Update</button>
                    </form>
                    <div className="form--link">
                        <Link to="/profile">Cancel</Link>
                    </div>
                </div>
            </div>
        </div>
  );
}
