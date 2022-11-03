import "./topbar.css";
import { useNavigate } from 'react-router-dom'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { AccountCircle} from '@material-ui/icons';

export default function Topbar() {
    let navigate = useNavigate();
    const userId=JSON.parse(localStorage.getItem('userId'));
    const isPhoto= userId.photourl?true:false;

    const Logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href= '/login';
    }

    return (
        <div className="topbar frostedGlass">
            <div className="topbarWrapper">
                <div className="topLeft">
                </div>
                <div className="topRight">
                     <NavDropdown title={
                            <div className="pull-left">
                                {userId.photourl?
                                    <img className="thumbnail-image topAvatar" 
                                    src={userId.photourl}
                                    alt={userId.displayName}/>
                                :<AccountCircle className="topAvatarIcon" />
                                }
                                
                            </div>
                        }  id="nav-dropdown" >
                        <NavDropdown.Item eventKey="4.1" className="NavDropdownItem">Edit Profile</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item eventKey="4.4" className="NavDropdownItem" onClick={Logout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </div>
            </div>
        </div>
        
    )
}
