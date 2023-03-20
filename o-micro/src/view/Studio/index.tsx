import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import {ToastElement, callToast} from '../../components/Toast';
import './style.scss';
import Header from '../../components/Header'
import Navigation from '../../components/Navigation'
import AudioAnalyser from "react-audio-analyser";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { uploadRecord } from '../../viewModel/StudioViewModel';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getSongInfo } from '../../viewModel/SongViewModel';
import { SongModel } from '../../model/SongModel';
import { Disc, Download, Mic } from 'react-feather';

interface IFormInputStudio {
  title: string;
}

export const AudioRecorder = () => {

  const [songInfo, setSongInfo] = useState<SongModel | null>(null);
  const [status, setStatus] = useState('');
  const [audioSrc, setAudioSrc] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isDoneRecording, setIsDoneRecording] = useState(false);
  const [popIn, setPopIn] = useState(false);
  const [blob, setBlob] = useState<Blob>(new Blob());
  const { register, handleSubmit, watch, formState: {errors} } = useForm<IFormInputStudio>();
  const navigate = useNavigate();

  // if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
  //   navigator.mediaDevices.getUserMedia({audio: true})
  // }
  const location = useLocation();
  
  const {id} = useParams();

  useEffect(() => {
    if (id) {
      (async () => {
        const song = await getSongInfo(id);
        setSongInfo(song);
    })()
    }
  }, [location])
  

  const handleRecorder = () => {
    setStatus(!isRecording ? 'recording' : 'inactive')
    setIsRecording(!isRecording);
  }

  // Définie les propriété de l'enregistrement & crée un blob une fois l'enregistrement fini
  // Crée un url pour permettre aux users de télécharger l'enregistrement en local
  const audioProps = {
    audioType: 'audio/mp3',
    status,
    audioSrc,
    /**
     * ! These params for better quality ?
     * check https://www.npmjs.com/package/react-audio-analyser
    */
  //  timeslice: 1000,
  //  audioOptions: {sampleRate: 30000},
    stopCallback: (blob: Blob) => {
      setAudioSrc(window.URL.createObjectURL(blob));
      setBlob(blob);
    },
  };

  const onSubmit: SubmitHandler<IFormInputStudio> = async data => {
    try {
      /**
       * ! Changer l'id du song avec le bon id !
       */
      const idSong = songInfo?.id!;
      const instrument = watch('title').trim().replaceAll(' ', '_');

      if (instrument.length == 0) throw Error('Le nom de l\'instrument ne peut pas être vide');
      if (!audioSrc) throw Error('Rien n\'a été enregistré !');
      
      const sendRecord = await uploadRecord({ idSong, instrument, blob})
      navigate('/records/' + idSong)

      if (sendRecord) setIsDoneRecording(true);
    } catch (e: any) {
      callToast({ message: e.message });
    }
  };

  const isPopin =  (e: Event) => {
    if(!(e.target as HTMLElement).closest('.studio_popIn')) {
      setPopIn(false);
      removeEventListener('click', isPopin);
    }
  }

  const handlePopIn = () => {
    setPopIn(true);
    setTimeout(() =>  addEventListener('click', isPopin), 200);
  }

  return (
    <div className='studio_main'>
      <Header />
      <ToastElement />

      {popIn ? 
      <div className="studio_popInContainer">
       <div className="studio_popIn">
        <p className="studio_popInTitle">Quel instrument a été enregistré ?</p>
          <form className="studio_popInFormContainer" onSubmit={handleSubmit(onSubmit)} >
            <div className="studio_popInInputContainer">
              <Disc className='studio_popInInputIcon'/>
              <input 
                {...register("title") } 
                type="text"
                required
                placeholder="Le nom de l'instrument"
                className='studio_popInInput'
              />
            </div>
            <div className="studio_popInFileContainer">
              <p className="studio_popInFileTitle">
                Télécharger l'audio
              </p>
              <a className="studio_popInFileInputContainer" href={audioSrc} download={watch('title')?.trim() ?? 'My awesome song'}>
                <span >
                <Download className='studio_popInFileInputIcon'/> 
                  Télécharger
                  </span>
              </a>
            </div>
          <button type='submit' className='studio_popInBtn'>Terminer</button>
          </form>
       </div>
      </div>
      : ''}

      <div className="studio_informationsContainer">
       <div className="studio_informationsTitleContainer">
        <div className='studio_pageTitle'>Le studio</div>
          <p className='studio_songTitle' onClick={() => navigate('/records/' + songInfo?.id)}> {songInfo?.title}</p>
       </div>
        <div className='studio_description'>Essayez d’enregistrer dans un endroit calme pour avoir le meilleur rendu possible.</div>
      </div>
      <AudioAnalyser {...audioProps}>
        <div className="audioContainer_actions">
          <div className='studio_recordContainer' onClick={handleRecorder}>
            {!isRecording ? 
              <div className='studio_recordBox'>
                <Mic className="studio_recordIcon" />
                  Appuyer pour démarrer
              </div> : 
              <div className='studio_recordBox -stop'>
                  Appuyer pour couper
              </div> }
          </div>
        </div>
      </AudioAnalyser>
      <div className={`studio_backgroundRecording ${isRecording ? '-active' : ''}`}></div>
      <div className="studio_optionsRecordsContainer">
        <div className="studio_optionsRecords">
          <div className="studio_optionsRecordsDescription"> 
            <p className="studio_optionsRecordsDecsriptionTitle">
              Backing track  
            </p>  
            <p className="studio_optionsRecordsDecsriptionContent">
              Le port du casque ou des écouteurs est recommandé.  
            </p>  
          </div>  
          <input className="studio_optionsRecordsToggle" type="checkbox" />
        </div>
      </div>
      <div className="studio_createRecordBtnContainer">
        <button type='submit' className={`studio_createRecordBtn ${!audioSrc ? '-inactive' : ''}`} onClick={handlePopIn}>Valider</button>
      </div>
      {/* <form 
        onSubmit={handleSubmit(onSubmit)} 
        className='studio_form'
      >
        <div className={`studio_box ${isRecording ? '-active' : ''}`}>
          <input 
            {...register("title") } 
            type="text"
            required
          />
          <label>Nom de l'instrument</label>
        </div>
        <button className='studio_submitBtn' type="submit">Valider</button>
      </form> */}

      <div className={`studio_doneContainer ${isDoneRecording ? '-active' : ''}`}>
        <div className="studio_done">
          Enregistrement terminé !
          <div className="studio_doneActions">
            <a href={audioSrc} download={watch('title')?.trim()} className='studio_downloadButton'>
              <FontAwesomeIcon icon={faDownload} className="iconRecord" size="sm"/>
              <span>Télécharger</span>
            </a>
            <a onClick={() => navigate('/records/' + songInfo?.id)}>
              Passer
            </a>
          </div>
        </div>
      </div>
    </div>
    );
}

export default AudioRecorder;