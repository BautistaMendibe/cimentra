import Localidad from "./Localidad";

export default class Provincia {
    id: string;
    nombre: string;
    localidades: Localidad[];

    constructor(id: string, nombre: string, localidades: Localidad[]) {
        this.id = id;
        this.nombre = nombre;
        this.localidades = localidades;
    }
}