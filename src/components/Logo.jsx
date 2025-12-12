
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Logo() {
    
    return (
        
        <div className="logo">
            <Link to="/"> 
                <div className="logo--text">
                    <span>Workout</span>
                    <span>Tracker</span>
                </div>
                <div className="logo--icon">
                   <span class="material-symbols-outlined">exercise</span>
                </div>
            </Link>
        </div>
       
    )
}
