import Localidad from "./Localidad";

export default class Provincia {
    id: number;
    nombre: string;
    localidades: Localidad[];

    constructor(id: number, nombre: string, localidades: Localidad[]) {
        this.id = id;
        this.nombre = nombre;
        this.localidades = localidades;
    }
}