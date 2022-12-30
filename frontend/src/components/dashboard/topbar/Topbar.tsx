import styles from "./topbar.module.scss";
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom'
import NavDropdown from 'react-bootstrap/NavDropdown'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Topbar() {
    let navigate = useNavigate();
    const userId = JSON.parse(localStorage.getItem('userId'));
    // const isPhoto= userId.photourl?true:false;
    const isPhoto = false; // TODO: 待補 user photo

    const Logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
    }

    return (
        <div className={clsx(styles.topbar, 'frostedGlass')}>
            <div className={styles.wrapper}>
                <div className={styles.topLeft}></div>
                <div className={styles.topRight}>
                    <NavDropdown className={styles.navDropdown} title={
                        <div className={clsx("pull-left")}>
                            {/* {userId.photourl ?
                                <img className={clsx(styles.avatar, 'thumbnail-image')}
                                    src={userId.photourl}
                                    alt={userId.displayName} />
                                : <AccountCircleIcon className={styles.avatar} />
                            } */}
                             <AccountCircleIcon className={styles.avatar} />
                        </div>
                    } id="nav-dropdown" >
                        <NavDropdown.Item eventKey="4.1" className={styles.NavDropdownItem}>Edit Profile</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item eventKey="4.4" className={styles.NavDropdownItem} onClick={Logout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </div>
            </div>
        </div>

    )
}
