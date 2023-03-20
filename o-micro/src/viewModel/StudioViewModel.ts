import Record from '../types/record';
import ValidationError from '../utils/errorHandler';
import { callToast } from '../components/Toast';
import axios from 'axios';
import { getCookie } from '../utils/cookie';

/**
 * 
 * Envoie un enregistrement audio mp3 vers le serveur
 * 
 * @param idSong L'id du morceau 
 * @param instrument Le nom de l'instrument
 * @param blob L'enregistrement audio
 * @returns Un boolean de la réussite ou non de l'envoie au serveur
 * 
 */
export const uploadRecord = async ({idSong, instrument, blob}: Record): Promise<boolean> => {
    let response = true;

    // Création d'un fichier au format mp3 à partir du blob
    const recordFile = new File([blob], `${instrument}.mp3`, 
    {
        lastModified: new Date().getTime(),
        type: blob.type 
    });
    
    // Création d'un formData contenant le fichier mp3 + le nom de l'instrument
    const formData = new FormData();
    formData.append('instrument', instrument);  
    formData.append('path', recordFile);  
    const token = getCookie('user_tkn');

    await axios.post(`http://dylantrepos-server.eddi.cloud/api/song/${idSong}/record`, formData, {
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    }).catch(e => {
        callToast({message: (new ValidationError(e)).getErrorMessage()});
        response = false;
    });
    return response;
}

export const createSong = async ({idSong, instrument, blob}: Record): Promise<boolean> => {
    let response = true;
    const token = getCookie('user_tkn');

    // Création d'un fichier au format mp3 à partir du blob
    const recordFile = new File([blob], `${instrument}.mp3`, 
    {
        lastModified: new Date().getTime(),
        type: blob.type 
    });
    
    // Création d'un formData contenant le fichier mp3 + le nom de l'instrument
    const formData = new FormData();
    formData.append('instrument', instrument);  
    formData.append('path', recordFile);  

    await axios.post(`http://dylantrepos-server.eddi.cloud/api/song/${idSong}/record`, formData, {
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    }).catch(e => {
        callToast({message: (new ValidationError(e)).getErrorMessage()});
        response = false;
    });
    return response;
}