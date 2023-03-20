// TODO : Clean l'install avec BCRYPT
import ValidationError from '../utils/errorHandler';
import axios from 'axios';
import { callToast } from '../components/Toast';
import { getCookie } from '../utils/cookie';
import { getUserInfo } from './UserViewModel';
import { getBandInfo } from './BandViewModel';
import { SongModel } from '../model/SongModel';
import { rmSync } from 'fs';


type RegisterDatas = {
    title: string;
    image: File;
}

export const addNewSong = async (title: string, image: File[]): Promise<SongModel> => {
    
    let response = true;
        
    console.log('test : ', image)
    console.log('test : ', image[0].type)
    // Création d'un formData contenant le fichier image + le titre de la chanson
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image[0]);  
    /**
     * ! check img size before send, limit to 10mb
     * 
     */
    const token = getCookie('user_tkn');
    const res = await axios.post(`http://dylantrepos-server.eddi.cloud/api/song`, formData, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': `multipart/form-data`
        }
    }).catch(error => {
        response = false;
        throw new ValidationError(error).getErrorMessage();
    });
    return new SongModel(res.data);
}



export const getAllSongs = async (): Promise<SongModel[]> => {
    try {
        const token = getCookie('user_tkn');
        const res2 = await getBandInfo();
        const URL = 'http://dylantrepos-server.eddi.cloud/api/band/' + res2.id + '/songs';
        const res = await axios.get(URL, {
        headers: {'Authorization': `Bearer ${token}`,}
        })
        if (res.data.length > 0) return res.data.map((res: SongModel) => new SongModel(res));
        return res.data;

    } catch (error: any) {
        throw new ValidationError(error)
    }
}


export const getSongInfo = async (id: string): Promise<SongModel> => {
    try {
        const res = await getAllSongs();
        return res.filter((res => res.id == id))[0];

    } catch (error: any) {
        throw new ValidationError(error)
    }
}

export const updateSongTitle = async (title: string): Promise<Boolean> => {
    try {
        const token = getCookie('user_tkn');
        // const URL = 'http://kaelaenis-server.eddi.cloud:8080/api/band/' + res2.id + '/songs';
        // const res = await axios.get(URL, {
        // headers: {'Authorization': `Bearer ${token}`,}
        // })
        return true;
    } catch (error: any) {
        throw new ValidationError(error)
    }
}


export default () => '';