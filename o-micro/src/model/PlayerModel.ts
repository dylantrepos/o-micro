import axios from "axios";
import Record, { RecordRequest } from "../types/record";

export class PlayerModel {

    audios: NodeListOf<HTMLAudioElement>;
    playAllRecord: boolean = false;

    constructor(audios: NodeListOf<HTMLAudioElement>){
        this.audios = audios;
    }   

    playAll = () => {
        this.audios.forEach(audio => audio.play());
        console.log("audio : ", this.audios)
        this.playAllRecord = false;
    }
      
    pauseAll = () => {
        this.audios.forEach(audio => audio.pause());
        this.playAllRecord = true;
    }
    
    stopAll = () => {
        this.audios.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.playAllRecord = true;
    }
    
}
