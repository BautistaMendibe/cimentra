export default class Localidad {
    id: number;
    idProvincia: number;
    nombre: string;


    constructor(id: number, idProvincia: number, nombre: string) {
        this.id = id;
        this.idProvincia = idProvincia;
        this.nombre = nombre;
    }   
}