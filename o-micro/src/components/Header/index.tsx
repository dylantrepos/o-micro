import React, { useEffect, useState } from 'react'
import './style.scss'
import logo from '../../assets/images/omicro-logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Users } from 'react-feather';
import { getUserInfo } from '../../viewModel/UserViewModel';
import { getBandInfo, getCurrentBand } from '../../viewModel/BandViewModel';


type IFormHeader = {
    additionnalClasses?: string;
}

export default function index({additionnalClasses}: IFormHeader) {
    const navigate = useNavigate();
    const [band, setBand] = useState(null);
    useEffect(() => {
        getCurrentBand().then((data) => {
          setBand(data.data);
        });
      }, []);

    return (
        <div className={`header_container ${additionnalClasses ?? ''}`}>
            <Link to={'/home'} className="header_logoContainer">
                <img className="header_logo" src={logo} alt="logo O'micro" />
            </Link>
            <Link className='header_bandLink' to="/settings" onClick={() => navigate('/settings')}>
                <div className="header_bandContainer">
                    <Users className='header_bandIcon'/>
                    <div className="header_bandName">{band?.name}</div>
                </div>
            </Link>
        </div>
    )
}
