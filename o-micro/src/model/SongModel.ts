import SongRequest from "../types/song";

export class SongModel {

    band_id: string;
    created_at: string;
    id: string;
    image: string; 
    status: boolean;
    title: string;
    updated_at: string;

    constructor(song: SongRequest){
        this.band_id = song.band_id
        this.created_at = song.created_at;
        this.id = song.id;
        this.image = song.image 
        this.status = song.status;
        this.title = song.title;
        this.updated_at = song.updated_at;
    }

    getDateFr = () => (new Date(this.created_at)).toLocaleDateString('fr')
}