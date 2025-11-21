import React, { useRef, useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import Header from "../components/Header";
import Greeting from "../components/Greeting";


function Profile() {
    const [error, setError] = useState("");
    const { currentUser, logout, username, setShowProfile } = useAuth();
    const navigate = useNavigate(); 
    //setShowProfile(true);
   

return (
<>
    
    <div className="profile">
    <Greeting />
    
        {error && <Alert variant="danger">{error}</Alert> }
            
    </div>      
</>
)
}

export default Profile;