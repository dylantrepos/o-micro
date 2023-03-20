import './style.scss'
import Header from '../../components/Header'

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay, faStop, faX } from '@fortawesome/free-solid-svg-icons'
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import { SongModel } from '../../model/SongModel';
import { RecordModel } from '../../model/RecordModel';
import { getAllRecords } from '../../viewModel/RecordViewModel';
import { getSongInfo } from '../../viewModel/SongViewModel';
import { Disc, DivideSquare, Download, Headphones, Mic, MoreVertical, Plus } from 'react-feather';
import axios from 'axios';
import { RecordRequest } from '../../types/record';
import { getCookie } from '../../utils/cookie';

// const URL = 'http://kaelaenis-server.eddi.cloud:8080/api/song/1/record/';

type IFormInput = {
  newTitle?: string;
}

export default function index() {

  const [showOptionsOpen, setShowOptionsOpen] = useState(false);
  const [optionSelected, setOptionSelected] = useState(0);
  const [playingAll, setPlayingAll] = useState(true);
  const [recordsList, setRecordsList] = useState<[] | RecordModel[]>([]);
  const [songInfo, setSongInfo] = useState<null | SongModel>(null);
  const { register, handleSubmit, reset, formState: {errors} } = useForm<IFormInput>();

  const {id} = useParams();
  const navigate = useNavigate();


  /**
   * ! Doit rester là pour récupérer les audio
   */
  const getAllRecords = async (idSong: string) => {
    // Récupère les enregistrements bruts
    const token = getCookie('user_tkn')
    const request = await axios.get(`http://dylantrepos-server.eddi.cloud/api/song/${idSong}/records`, {
      headers: {
        'Authorization': 'Bearer '+token,
      }
    })
    console.log('res : ', request)
    
    const makeSongs: RecordModel[] = request?.data.map((req: RecordRequest) => {
      const token = getCookie('user_tkn');
      (async () => await axios.get('http://dylantrepos-server.eddi.cloud/api/song/' + idSong + '/record/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'audio/mp3',
        }
      }))();
      console.log('red : ', req)
      return new RecordModel({...req, path: req.path.replace('public', 'storage')});
    })
    
    return makeSongs;
  }

  useEffect(() => {
    (async () => {
      if (id) {
        console.log('id : ', id)
        const recordListResponse: RecordModel[] = await getAllRecords(id);
        const songInfoResponse: SongModel = await getSongInfo(id);
        console.log("record : ", recordListResponse)
        console.log("song : ", songInfoResponse)
        setRecordsList(recordListResponse);
        setSongInfo(songInfoResponse)
      }
    })()
  }, [])
  
  const handleOptionSelected = (optionId: number) => {
    setOptionSelected(optionId);
  }

  const handleCreateRecord = () => {
    navigate('/studio/' + id)
  }

  const myPlayer = (action: string) => {
    const audioFiles: NodeListOf<HTMLAudioElement> = document.querySelectorAll('audio');
    if (audioFiles) {
      switch (action) {
        case 'play': 
          audioFiles.forEach(audio => audio.play());
          setPlayingAll(false);
          break;
        case 'pause': 
          audioFiles.forEach(audio => audio.pause());
          setPlayingAll(true);
          break;
        case 'stop': {
          audioFiles.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
          });
          setPlayingAll(true);
          break;
        }
      } 
    }
  }

  return (


<div className='record_main'>
      <Header />
      <div className="record_informationsContainer">
        <div className='record_pageTitle'>{songInfo?.title}</div>
        <button className='record_addRecordBtn' onClick={handleCreateRecord}>
          <Mic className='record_addRecordIcon'/>
          <p>Créer un enregistrement</p>
        </button>
        <div className={`record_songsContainer ${recordsList?.length == 0 ? '-inactive' : ''}`}>
       {/* <div className='record_songImgCover'>
           {songInfo ? <img src={'http://kaelaenis-server.eddi.cloud:8080/images/songs/' + songInfo?.image} /> : ''}
       </div> */}
     </div>
    </div>
      {recordsList?.length > 0 ? 
      <div className='record_songsDetails'>
      <div className='record_songTitle'>
      <Headphones />
      <p>Ecouter tout ensemble</p>
      </div>
      <div className="record_songsPlayerContainer">
        {playingAll 
          ? <button className='record_songsPlayerButton' onClick={() => myPlayer('play')}>
              <FontAwesomeIcon icon={faPlay} className="iconImg" size="lg" />
            </button>
          : <button  className='record_songsPlayerButton'onClick={() => myPlayer('pause')}>
                  <FontAwesomeIcon icon={faPause} className="iconImg" size="lg" />
                </button>}
            <button className='record_songsPlayerButton' onClick={() => myPlayer('stop')}>
          <FontAwesomeIcon icon={faStop} className="iconImg" size="lg" />
        </button>
    </div>
      </div>
    : ''}
      <div className="record_songListContainer">
        <div className="record_songList">
              { recordsList?.length > 0 ? recordsList.map((record, key) => 
              <div className='record_songContainer' key={key}>
                <div className='record_songDetails'>
                  <div className='record_songTitle'>{record.instrument}</div>
                  <div className='record_songDate'>{record.getDateFr()}</div>
                </div>
                <div className="record_playerContainer">
                  <audio controls src={'http://dylantrepos-server.eddi.cloud/'+ record.path} className='record_player'></audio>
                </div>
                {/* <div className="records_songOptions" onClick={handleOptionsPopup}>
                  <div>
                      <FontAwesomeIcon icon={faEllipsis} className="iconImg" size="lg" />
                  </div>
                </div> */}
              </div>)
              :
              <div className="record_songNoRecordsContainer">
                  <p>Commencez avec votre premier enregistrement !</p>
              </div> 
              }
              {/* <div className='record_songContainer'>
                <div className='record_songDetails'>
                  <div className='record_songTitle'>Guitare</div>
                  <div className='record_songDate'>02/02/2023</div>
                </div>
                <div className="record_playerContainer">
                  <audio controls src={URL} className='record_player'></audio>
                </div>
              </div>

              <div className='record_songContainer'>
                <div className='record_songDetails'>
                  <div className='record_songTitle'>Guitare</div>
                  <div className='record_songDate'>02/02/2023</div>
                </div>
                <div className="record_playerContainer">
                  <audio controls src={URL} className='record_player'></audio>
                </div>
              </div>

              <div className='record_songContainer'>
                <div className='record_songDetails'>
                  <div className='record_songTitle'>Guitare</div>
                  <div className='record_songDate'>02/02/2023</div>
                </div>
                <div className="record_playerContainer">
                  <audio controls src={URL} className='record_player'></audio>
                </div>
              </div>

              <div className='record_songContainer'>
                <div className='record_songDetails'>
                  <div className='record_songTitle'>Guitare</div>
                  <div className='record_songDate'>02/02/2023</div>
                </div>
                <div className="record_playerContainer">
                  <audio controls src={URL} className='record_player'></audio>
                </div>
              </div> */}
        </div>
      </div>    
  </div>


    // <div className='records_main'>
    //   <Header />
    //   <div className="records_informationsContainer">
    //     <div className='records_pageTitle'>Les enregistrement</div>
    //     <div className='records_description'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum ducimus consequuntur fuga laudantium est quo sapiente distinctio. Non maxime omnis, consectetur ratione deleniti consequuntur odio, perferendis harum sunt explicabo excepturi.</div>
    //     <div className={`records_songsContainer ${recordsList?.length == 0 ? '-inactive' : ''}`}>
    //       <div className='records_songImgCover'>
    //           {songInfo ? <img src={'http://kaelaenis-server.eddi.cloud:8080/images/songs/' + songInfo?.image} /> : ''}
    //       </div>
    //       <div className='records_songsDetails'>
    //         <div className='records_songTitle'>{songInfo?.title}</div>
    //       <div className="records_songsPlayerContainer">
    //         {playingAll 
    //           ? <button className='records_songsPlayerButton' onClick={() => myPlayer('play')}>
    //               <FontAwesomeIcon icon={faPlay} className="iconImg" size="lg" />
    //             </button>
    //           : <button  className='records_songsPlayerButton'onClick={() => myPlayer('pause')}>
    //               <FontAwesomeIcon icon={faPause} className="iconImg" size="lg" />
    //             </button>}
    //         <button className='records_songsPlayerButton' onClick={() => myPlayer('stop')}>
    //           <FontAwesomeIcon icon={faStop} className="iconImg" size="lg" />
    //         </button>
    //       </div>
    //       </div>
    //     </div>
    //   </div>
    //   {recordsList?.length > 0 ? <div className="records_songListContainer">
    //     <div className="records_songList">
    //       { recordsList ? recordsList.map((song, key) => 
    //         <div className='records_songContainer' key={key}>
    //           <div className='records_songDetails'>
    //             <div className='records_songTitle'>{song.instrument}</div>
    //             <div className='records_songDate'>{song.getDateFr()}</div>
    //           </div>
    //           <div className="records_playerContainer">
    //             <audio controls src={URL + song.id} className='records_player'></audio>
    //           </div>
    //           {/* <div className="records_songOptions" onClick={handleOptionsPopup}>
    //             <div>
    //                 <FontAwesomeIcon icon={faEllipsis} className="iconImg" size="lg" />
    //             </div>
    //           </div> */}
    //         </div>)
    //          : '' }
    //     </div>
    //   </div> : 
    //   <div className="records_emptyRecords">
    //     <p className="records_emptyRecordsTitle">Ce morceau n'a pas encore d'enregistrement ! </p>
    //     <button className="records_emptyRecordsBtn" onClick={() => navigate('/studio/' + songInfo?.id)}>Créer un enregistrement</button>
    //   </div>}

      
    // <div className={`records_songOptionsPopupContainer ${!showOptionsOpen ? '-out' : ''}`} onClick={handleClosePopup}>
    //     <div className='records_songOptionsPopup'>
    //       <div className='records_songOptionsPopupTitle'>
    //         <p>Options </p>
    //         <FontAwesomeIcon icon={faX} className="iconClose" size="sm" onClick={handleOptionsPopup}/>
    //         </div>
    //       <div className='records_songOptionsPopupActions'>
    //         {optionSelected === 0 ? 
    //           <div className='records_songOptionsPopupSelection'>
    //             <div className='records_songOptionsPopupEdit' onClick={() => handleOptionSelected(1)}>Modifier le titre</div>
    //             <div className='records_songOptionsPopupDelete' onClick={() => handleOptionSelected(2)}>Supprimer l'enregistrement</div>
    //           </div> : 
    //           optionSelected === 1 ?
    //           <div className='records_songOptionsPopupEditTitle'>
    //             <p>Indiquez ci-dessous le nouveau titre du morceau</p>
    //             <form 
    //               onSubmit={handleSubmit(onSubmit)} 
    //               className='navigation_form'
    //             >
    //               <div className='navigation_formContainer'>
    //                   <input 
    //                   {...register("newTitle") } 
    //                   type="text"
    //                   placeholder='Nom de la chanson'
    //                   required
    //                   className='navigation_formElement'
    //                   />
    //               </div>
    //               <button className='navigation_formBtn' type="submit">Valider</button>
    //           </form>
    //           </div> :
    //           <div className='records_songOptionsPopupRemoveSong'>
    //              <p>Attention, cette action est irréversible. Êtes-vous sûr de vouloir supprimer cet enregistrement ?</p>
    //              <button onClick={handleRemove}>Confirmer la suppression</button>
    //           </div>}
    //       </div>
    //     </div>
    //   </div> 
    //   <Navigation />
    // </div>
  )
}
