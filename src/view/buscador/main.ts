// Vista del buscador: solo presentación. Los datos vienen, de momento, de
// /demo/alumnos.json; se sustituirá por la API cuando exista.
import { filtrarAlumnos, type AlumnoCard, type Filtros, type Modalidad } from './filtros.js';

const TECNOLOGIAS = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Testing'];
const MODALIDADES: { valor: Modalidad; texto: string }[] = [
  { valor: 'remoto', texto: 'Remoto' },
  { valor: 'hibrido', texto: 'Híbrido' },
  { valor: 'presencial', texto: 'Presencial' },
];
const TEXTO_MODALIDAD: Record<Modalidad, string> = {
  remoto: 'Remoto',
  hibrido: 'Híbrido',
  presencial: 'Presencial',
};
const SVG_NS = 'http://www.w3.org/2000/svg';

const filtros: Filtros = {};
const guardados = new Set<string>();
let alumnos: AlumnoCard[] = [];

// Crea un elemento; el texto va siempre por textContent, nunca innerHTML con datos.
function el<K extends keyof HTMLElementTagNameMap>(tag: K, clase?: string, texto?: string) {
  const n = document.createElement(tag);
  if (clase) n.className = clase;
  if (texto !== undefined) n.textContent = texto;
  return n;
}

function iniciales(nombre: string) {
  return nombre.split(/\s+/).map((p) => p[0] ?? '').join('').slice(0, 2).toUpperCase();
}

function iconoMarcador(relleno: boolean) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', relleno ? 'currentColor' : 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z');
  svg.append(path);
  return svg;
}

function chips(
  contenedor: HTMLElement,
  opciones: { valor: string; texto: string }[],
  actual: () => string | undefined,
  fijar: (v?: string) => void,
) {
  contenedor.replaceChildren();
  for (const o of opciones) {
    const b = el('button', 'chip', o.texto);
    b.type = 'button';
    b.setAttribute('aria-pressed', String(actual() === o.valor));
    b.addEventListener('click', () => {
      fijar(actual() === o.valor ? undefined : o.valor);
      pintar();
    });
    contenedor.append(b);
  }
}

function tarjeta(a: AlumnoCard) {
  const art = el('article', 'tarjeta');

  const cab = el('div', 'tarjeta__cabecera');
  const id = el('div', 'tarjeta__id');
  const avatar = el('div', 'avatar', iniciales(a.nombre));
  avatar.setAttribute('aria-hidden', 'true');
  const nombres = el('div', 'tarjeta__nombres');
  nombres.append(el('span', 'tarjeta__nombre', a.nombre), el('span', 'tarjeta__edicion', a.edicion));
  id.append(avatar, nombres);

  const on = guardados.has(a.id);
  const guardar = el('button', 'boton-icono');
  guardar.type = 'button';
  guardar.setAttribute('aria-pressed', String(on));
  guardar.setAttribute('aria-label', on ? `Quitar a ${a.nombre} de guardados` : `Guardar a ${a.nombre}`);
  guardar.append(iconoMarcador(on));
  guardar.addEventListener('click', () => {
    if (on) guardados.delete(a.id);
    else guardados.add(a.id);
    pintar();
  });
  cab.append(id, guardar);

  const stack = el('div', 'etiquetas');
  for (const t of a.stack) stack.append(el('span', 'etiqueta', t));

  const buscando = a.estadoLaboral === 'buscando';
  const meta = el('div', 'tarjeta__meta');
  meta.append(
    el('span', '', a.ubicacion),
    el('span', '', TEXTO_MODALIDAD[a.modalidad]),
    el('span', buscando ? 'estado estado--buscando' : 'estado estado--trabajando',
      buscando ? 'Buscando empleo' : 'Trabajando'),
  );

  const ver = el('a', 'boton-secundario', 'Ver ficha');
  ver.setAttribute('aria-disabled', 'true');
  ver.title = 'La ficha del alumno llega con la T15';

  art.append(cab, el('p', 'tarjeta__resumen', a.resumen), stack, meta, ver);
  return art;
}

function pintar() {
  chips(
    document.getElementById('f-tecnologia')!,
    TECNOLOGIAS.map((t) => ({ valor: t, texto: t })),
    () => filtros.tecnologia,
    (v) => { filtros.tecnologia = v; },
  );
  chips(
    document.getElementById('f-modalidad')!,
    MODALIDADES,
    () => filtros.modalidad,
    (v) => { filtros.modalidad = v as Modalidad | undefined; },
  );

  const lista = filtrarAlumnos(alumnos, filtros);
  document.getElementById('resultados')!.replaceChildren(...lista.map(tarjeta));
  document.getElementById('contador')!.textContent =
    lista.length === 1 ? '1 perfil encontrado' : `${lista.length} perfiles encontrados`;
  document.getElementById('n-guardados')!.textContent = String(guardados.size);
}

async function iniciar() {
  const q = document.getElementById('f-texto') as HTMLInputElement;
  q.addEventListener('input', () => { filtros.texto = q.value; pintar(); });
  const traslado = document.getElementById('f-traslado') as HTMLInputElement;
  traslado.addEventListener('change', () => { filtros.soloTraslado = traslado.checked; pintar(); });
  const buscando = document.getElementById('f-buscando') as HTMLInputElement;
  buscando.addEventListener('change', () => { filtros.soloBuscando = buscando.checked; pintar(); });
  filtros.soloBuscando = buscando.checked;

  const res = await fetch('/demo/alumnos.json');
  alumnos = await res.json();
  pintar();
}

iniciar();
