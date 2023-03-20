import React from 'react';
import './style.scss'
import Logo from '../../components/Logo';
import { Link } from 'react-router-dom';

export default function index() {
  return (
    <div className='main'>
      <div className='description_container'>
          <Logo animated/>
          <div className='title'>L'application au service des musiciens</div>
          <div className='description'>
            L'objectif est de 
            permettre aux différents membres d'un même groupe d'enregistrer des 
            idées pour un nouveau morceau et de le partager aux autres membres.
          </div>
          <div className='description_stepBullet'>
            <div className='description_stepNumber'>1</div>
              Je rejoins ou je crée mon groupe
          </div>
          <div className='description_stepBullet'>
            <div className='description_stepNumber'>2</div>
              Je crée un nouveau morceau
          </div>
          <div className='description_stepBullet'>
            <div className='description_stepNumber'>3</div>
              Je partage l'enregistrement aux autres membres du groupe
          </div>
          <Link className='cta_start' to="/login">Lancer l'application</Link>
        </div>
    </div>
  )
}
