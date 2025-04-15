export default class Cliente {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
    provincia: string;
    id_provincia: number;
    localidad: string;
    id_localidad: number;
    calle: string;

    constructor(id: string, nombre: string, apellido: string, email: string, telefono: string, direccion: string, id_provincia: number, provincia: string, id_localidad: number, localidad: string, calle: string) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.telefono = telefono;
        this.id_provincia = id_provincia;
        this.direccion = direccion;
        this.provincia = provincia;
        this.localidad = localidad;
        this.id_localidad = id_localidad;
        this.calle = calle;
    }
}