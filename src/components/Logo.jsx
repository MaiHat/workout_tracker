
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useAuth } from "../contexts/authContext";

export default function Logo() {
    const { currentUser } = useAuth();

    const linkTo = currentUser ? "/profile" : "/";
    return (
        
        <div className="logo">
            <Link to={linkTo}> 
                <div className="logo--text">
                    <span>Workout</span>
                    <span>Tracker</span>
                </div>
                <div className="logo--icon">
                   <span className="material-symbols-outlined">exercise</span>
                </div>
            </Link>
        </div>
       
    )
}
