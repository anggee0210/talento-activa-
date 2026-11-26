import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';

// Controlador: rutas de la API bajo /api/*.
const api = new Hono();
api.get('/health', (c) => c.json({ ok: true }));
api.all('/*', (c) => c.json({ error: 'No encontrado' }, 404));

export const app = new Hono();
app.route('/api', api);

// Vista: ficheros estáticos de la interfaz.
app.use('/*', serveStatic({ root: './src/view/public' }));
