import React,{ useState, useRef } from 'react'
import { Form,  Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Logo from "../components/Logo";

export default function AccountProfile() {
    const userNameRef = useRef();
    const { currentUser, username, updateUserName, changeEmail, changePassword } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 
  

    async function handleSubmit(event) {
        event.preventDefault();
        const enteredName = userNameRef.current.value;

        setErrorMessage("")
         setLoading(true);
        if(enteredName === username) {
            setErrorMessage("Enter new Username");
        }
        try {
        if (enteredName !== username) {
            updateUserName(enteredName);
        }
        console.log("changed profile:", enteredName);
        } catch (err) {
        setErrorMessage("failed update profile.");
        console.log(err);
        }
        setLoading(false);
    } 

    return (
        <div className="form">
            <Logo />
            <div className='form--wrapper'>
                <div className='form--card'>
                    <h2 className="form--title">Account Profile</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>User Name</label>
                            <input
                            id="username"
                            type="text" 
                            ref={userNameRef} 
                            required 
                            defaultValue={username}/>
                            <button disabled={loading} className="btn--secondary small-btn" type="submit">Change user Name</button>
                        </div>
                           {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    </form>

                    <h4>email: </h4><h3>{currentUser.email}</h3>
                    
                    <div className='change-links'>
                        <Link className='btn--secondary'>Change Email address</Link>
                        <Link to="/forgot-password" className='btn--secondary'>Change Password</Link>

                       
                    </div>
                    <div>
                        <h2>Sorry</h2>
                        <h3>Still workoing on this page</h3></div>
                    <div className="form--link btn--secondaryxs">
                        <Link to="/profile">Back</Link>
                    </div>
                </div>
            </div>
        </div>
  );
}