import Structure from "./structure";

export default class Map{
    name: string;
    width: number;
    height: number;
    structures: Structure[];
    constructor(name: string){
        this.name = name;
        this.width = 0;
        this.height = 0;
        this.structures = [];
    }
}