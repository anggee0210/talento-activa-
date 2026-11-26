// Lógica pura del buscador (sin DOM) para poder testearla.

export type Modalidad = 'remoto' | 'hibrido' | 'presencial';
export type EstadoLaboral = 'buscando' | 'trabajando';

export interface AlumnoCard {
  id: string;
  nombre: string;
  edicion: string;
  resumen: string;
  stack: string[];
  ubicacion: string;
  modalidad: Modalidad;
  estadoLaboral: EstadoLaboral;
  trasladoDisponible: boolean;
  estado: 'activo' | 'inactivo';
}

export interface Filtros {
  texto?: string;
  tecnologia?: string;
  modalidad?: Modalidad;
  soloTraslado?: boolean;
  soloBuscando?: boolean;
}

const normalizar = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

export function filtrarAlumnos(alumnos: AlumnoCard[], f: Filtros): AlumnoCard[] {
  const texto = f.texto ? normalizar(f.texto) : '';
  return alumnos.filter((a) => {
    // Invariante de privacidad: un inactivo nunca es consultable.
    if (a.estado !== 'activo') return false;
    if (f.tecnologia && !a.stack.includes(f.tecnologia)) return false;
    if (f.modalidad && a.modalidad !== f.modalidad) return false;
    if (f.soloTraslado && !a.trasladoDisponible) return false;
    if (f.soloBuscando && a.estadoLaboral !== 'buscando') return false;
    if (texto) {
      const enNombre = normalizar(a.nombre).includes(texto);
      const enStack = a.stack.some((t) => normalizar(t).includes(texto));
      if (!enNombre && !enStack) return false;
    }
    return true;
  });
}
