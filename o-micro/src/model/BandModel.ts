import BandRequest from "../types/band";

export class BandModel {

    id: string;
    name: string;

    constructor(band: BandRequest){
        this.id = band.id;
        this.name = band.name;
    }   
}
