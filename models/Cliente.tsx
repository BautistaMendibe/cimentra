export default class Cliente {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
    provincia: string;
    localidad: string;
    calle: string;

    constructor(id: string, nombre: string, apellido: string, email: string, telefono: string, direccion: string, provincia: string, localidad: string, calle: string) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.telefono = telefono;
        this.direccion = direccion;
        this.provincia = provincia;
        this.localidad = localidad;
        this.calle = calle;
    }
}