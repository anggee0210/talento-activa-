import { describe, it, expect } from 'vitest';
import { app } from '../../src/app.js';

describe('página del buscador de alumnos', () => {
  it('GET /alumnos.html sirve el buscador en HTML', async () => {
    const res = await app.request('/alumnos.html');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');
    const html = await res.text();
    expect(html).toContain('<html lang="es"');
    expect(html).toContain('Alumnos disponibles');
    expect(html).toContain('/js/buscador.js');
  });

  it('avisa de que los datos son de ejemplo mientras no hay API', async () => {
    const html = await (await app.request('/alumnos.html')).text();
    expect(html).toContain('Datos de ejemplo');
  });
});
