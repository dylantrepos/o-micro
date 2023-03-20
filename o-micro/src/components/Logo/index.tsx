import React from 'react';
import './style.scss'
import LogoImg from '../../assets/icons';

export default function index({ animated = false, size = false}) {
  return (
    <div className={`logo ${size ? '-small' : ''}`}>
      <div className='logo_container'>
        <LogoImg animated={animated}/>
      </div>
      <div className='title-page logo_name'>'MICRO</div>
    </div>
  )
}
