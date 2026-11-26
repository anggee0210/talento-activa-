import { describe, it, expect } from 'vitest';
import { app } from '../src/app.js';

describe('andamiaje de la app', () => {
  it('GET /api/health responde 200 con { ok: true }', async () => {
    const res = await app.request('/api/health');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('GET / sirve la página de acceso en HTML', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');
    const html = await res.text();
    expect(html).toContain('<html lang="es"');
    expect(html).toContain('Iniciar sesión');
  });

  it('la página de acceso no ofrece registro público', async () => {
    const html = await (await app.request('/')).text();
    expect(html.toLowerCase()).not.toContain('crear cuenta');
    expect(html.toLowerCase()).not.toContain('regístrate');
  });

  it('una ruta /api desconocida responde 404 en JSON', async () => {
    const res = await app.request('/api/no-existe');
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'No encontrado' });
  });
});
