import React from 'react'
import './style.scss'
import logo from '../../assets/images/logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faGear } from '@fortawesome/free-solid-svg-icons'

type IFormHeader = {
    additionnalClasses?: string;
}

export default function index({additionnalClasses}: IFormHeader) {
    const navigate = useNavigate();

    return (
        <div className={`header_container ${additionnalClasses ?? ''}`}>
            <div className="header_iconBack">
                { (useLocation().pathname  != '/home') ?<Link to="/register" onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faChevronLeft} className="iconImg" size="lg" />
                </Link> : ''}
                
            </div>
            <div className="header_logoContainer">
                <img src={logo} alt="logo O'micro" />
            </div>
            <div className="header_iconSettings">
                <Link to="/register" onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faGear} className="iconImg" size="lg" />
                </Link>
            </div>
            <div className="header_menuContainer">
                <ul>
                    <li>
                        <Link to="/home">Mes morceaux</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}
