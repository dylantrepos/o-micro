import { useEffect, useState } from 'react';
import Header from '../../components/Header'
import myImage from '../../assets/images/logo.png'
import './style.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis, faX } from '@fortawesome/free-solid-svg-icons'
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ValidationError from '../../utils/errorHandler';
import { getCookie } from '../../utils/cookie';
import { SongModel } from '../../model/SongModel';
import { getUserInfo } from '../../viewModel/UserViewModel';
import { getBandInfo } from '../../viewModel/BandViewModel';
import { addNewSong, getAllSongs } from '../../viewModel/SongViewModel';
import { BandModel } from '../../model/BandModel';
import { Disc, Download, MoreVertical, Music, Plus } from 'react-feather';
import { callToast } from '../../components/Toast';

type IFormInput = {
  songTitle: string;
  songImage?: File;
}

export default function index() {

  const [showOptionsOpen, setShowOptionsOpen] = useState(false);
  const [optionSelected, setOptionSelected] = useState(0);
  const [closingAnim, setClosingAnim] = useState(false);
  const [userInfos, setUserInfos] = useState(null);
  const [popIn, setPopIn] = useState(false);
  const [bandInfos, setBandInfos] = useState<BandModel | null>(null);
  const [handleSongs, setHandleSongs] = useState<SongModel[] | null>(null);
  const { register, handleSubmit, reset, formState: {errors} } = useForm<IFormInput>();
  const navigate = useNavigate();

  const handleOptionsPopup = () => {
    setShowOptionsOpen(!showOptionsOpen)
    reset();
    handleOptionSelected(0);
  }

  const handleOptionSelected = (optionId: number) => {
    setOptionSelected(optionId);
  }

  const handleRemove = () => {
    console.log('Song removed !');
  }

  const handleClosePopup = (event: any) => {
    if(event.target.classList.contains('home_songOptionsPopupContainer')) handleOptionsPopup();
  }

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    if (data.songTitle) {
        if (data.songTitle?.trim().length > 0) {
            try {
                const res = await addNewSong(data.songTitle, data.songImage);
                navigate('/studio/' + res.id);
            } catch (e: any) {
                callToast({message: e});
            }      
        }
    }
};

  const fetchBandSongs = async () => {
    try {
      const res2 = await getBandInfo();
      const res3 = await getAllSongs();
      setBandInfos(res2);
      setHandleSongs(res3);
      console.log('band : ', res2)
      console.log('songs : ', res3)
  } catch (error: any) {
      throw new ValidationError(error)
  }
  }
  
  const isPopin =  (e: Event) => {
    if(!(e.target as HTMLElement).closest('.home_popIn')) {
      setPopIn(false);
      removeEventListener('click', isPopin);
    }
  }

  const handlePopIn = () => {
    setPopIn(true);
    setTimeout(() =>  addEventListener('click', isPopin), 200);
  }

  useEffect(() => {
    fetchBandSongs();
  }, [])

  return (
    <div className='home_main'>
      <Header />
      {popIn ? 
      <div className="home_popInContainer">
       <div className="home_popIn">
        <p className="home_popInTitle">Quel est le nom de votre prochain hit ?</p>
          <form className="home_popInFormContainer" onSubmit={handleSubmit(onSubmit)} >
            <div className="home_popInInputContainer">
              <Disc className='home_popInInputIcon'/>
              <input 
              {...register("songTitle") } 
              type="text"
              placeholder='My awesome song' 
              required
              className='home_popInInput'
              />
            </div>
            <div className="home_popInFileContainer">
              <p className="home_popInFileTitle">
                Ajouter une cover
              </p>
              <div className="home_popInFileInputContainer">
                <input 
                {...register("songImage") } 
                type="file"                                        
                className='home_popInFileInput'
                id='file'
                />
                <label htmlFor="file">
                <Download className='home_popInFileInputIcon'/> 
                  Télécharger
                  
                  </label>
              </div>
            </div>
          <button type='submit' className='home_popInBtn'>Créer</button>
          </form>
       </div>
      </div>
      : ''}
      <div className="home_informationsContainer">
        <div className='home_pageTitle'>Mes morceaux</div>
        <button className='home_addRecordBtn' onClick={handlePopIn}>
          <Plus className='home_addRecordIcon'/>
          <p>Créer un morceau</p>
        </button>
      </div>
      <div className="home_songListContainer">
      <div className="home_songList">
        {handleSongs ? handleSongs.map((song, key) => 
            <div className='home_songContainer' key={key}>
              <div className='home_songImgCover' onClick={() => navigate('/records/'+ song.id)}>
                <img src={'http://dylantrepos-server.eddi.cloud/images/songs/' + song.image} />
              </div>
              <div className='home_songDetails' onClick={() => navigate('/records/'+ song.id)}>
                <div className='home_songTitle'>{song.title}</div>
                <div className='home_songDate'>{song.getDateFr()}</div>
              </div>
              <div className="home_songOptions" onClick={handleOptionsPopup}>
                <div>
                   <MoreVertical className='home_iconOptions' />
                </div>
              </div>        
            </div> ) : 'Loading...'}
      </div>
      </div>    
    </div>
  )
}
