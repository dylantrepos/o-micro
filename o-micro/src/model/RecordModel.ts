import axios from "axios";
import Record, { RecordRequest } from "../types/record";

export class RecordModel {

    comment: string;
    created_at: string;
    id: number;
    instrument: string; 
    path: string;
    song_id: number;
    status: boolean;
    updated_at: string;
    user_id: number;

    constructor(record: RecordRequest){
        this.comment = record.comment;
        this.created_at = record.created_at;
        this.id = record.id;
        this.instrument = record.instrument;
        this.path = record.path;
        this.song_id = record.song_id;
        this.status = record.status;
        this.updated_at = record.updated_at;
        this.user_id = record.user_id;
    }   

    getDateFr = () => (new Date(this.created_at)).toLocaleDateString('fr')
}
