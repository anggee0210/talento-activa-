import { describe, it, expect } from 'vitest';
import { filtrarAlumnos, type AlumnoCard } from '../../src/view/buscador/filtros.js';

const base: AlumnoCard = {
  id: 'a', nombre: 'Ana Ruiz', edicion: 'Edición 2026 · primavera', resumen: 'Front-end',
  stack: ['JavaScript', 'React'], ubicacion: 'Barcelona', modalidad: 'hibrido',
  estadoLaboral: 'buscando', trasladoDisponible: true, estado: 'activo',
};
const alumnos: AlumnoCard[] = [
  base,
  { ...base, id: 'b', nombre: 'Marc Soler', stack: ['Node.js', 'SQL'], modalidad: 'remoto', trasladoDisponible: false },
  { ...base, id: 'c', nombre: 'Lucía Martín', stack: ['JavaScript', 'SQL'], modalidad: 'presencial', estadoLaboral: 'trabajando' },
  { ...base, id: 'd', nombre: 'Oculto Inactivo', estado: 'inactivo' },
];
const ids = (xs: AlumnoCard[]) => xs.map((x) => x.id);

describe('filtrarAlumnos', () => {
  it('sin filtros devuelve todos los activos', () => {
    expect(ids(filtrarAlumnos(alumnos, {}))).toEqual(['a', 'b', 'c']);
  });

  it('nunca devuelve alumnos inactivos, ni buscándolos por nombre', () => {
    expect(ids(filtrarAlumnos(alumnos, { texto: 'oculto' }))).toEqual([]);
  });

  it('filtra por tecnología', () => {
    expect(ids(filtrarAlumnos(alumnos, { tecnologia: 'SQL' }))).toEqual(['b', 'c']);
  });

  it('filtra por modalidad', () => {
    expect(ids(filtrarAlumnos(alumnos, { modalidad: 'remoto' }))).toEqual(['b']);
  });

  it('busca por texto en nombre o stack, sin distinguir mayúsculas ni tildes', () => {
    expect(ids(filtrarAlumnos(alumnos, { texto: 'lucia' }))).toEqual(['c']);
    expect(ids(filtrarAlumnos(alumnos, { texto: 'node' }))).toEqual(['b']);
  });

  it('filtra por disponibilidad de traslado y por solo buscando empleo', () => {
    expect(ids(filtrarAlumnos(alumnos, { soloTraslado: true }))).toEqual(['a', 'c']);
    expect(ids(filtrarAlumnos(alumnos, { soloBuscando: true }))).toEqual(['a', 'b']);
  });

  it('combina filtros', () => {
    expect(ids(filtrarAlumnos(alumnos, { tecnologia: 'JavaScript', soloBuscando: true }))).toEqual(['a']);
  });
});
