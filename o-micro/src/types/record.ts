/**
 * idSong: L'id du morceau
 * instrument: Le nom de l'instrument
 * blob: L'enregistrement audio
 */
type Record = {
    idSong: string;
    instrument: string;
    blob: Blob;
}

export type RecordRequest = {
    comment: string
    created_at: string
    id: number,
    instrument: string,
    path: string,
    song_id: number,
    status: boolean,
    updated_at: string,
    user_id: number
}

export default Record;