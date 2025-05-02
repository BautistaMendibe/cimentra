import Cliente from "./Cliente";
import Provincia from "./Provincia";

export interface Proyecto {
  id: number;
  nombre: string;
  fecha_inicio: string; // ISO string
  fecha_fin: string | null;
  id_tipo: string; // UUID
  id_estado: string; 
  id_presupuesto: string | null; // UUID o null
  activo: boolean;
  created_by: string; // UUID del usuario
  id_provincia: number;
  id_localidad: number;
  calle: string;
  id_cliente: string;
  cliente: Cliente;


  // Campos relacionados opcionales (para mostrar)
  provincia?: string;
  localidad?: string;
  tipo?: string;
  estado?: string;
  icono_tipo?: string; // Icono del tipo de proyecto
  color_estado?: string; // Color del estado del proyecto
  cliente_nombre: string;
  cliente_apellido: string;
}
