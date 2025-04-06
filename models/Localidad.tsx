export default class Localidad {
    id: string;
    idProvincia: string;
    nombre: string;


    constructor(id: string, idProvincia: string, nombre: string) {
        this.id = id;
        this.idProvincia = idProvincia;
        this.nombre = nombre;
    }   
}