// Arranque de desarrollo: recompila la vista al guardar y reinicia el servidor
// al cambiar el backend. Uso: npm run dev
import { spawn } from 'node:child_process';

const vista = spawn(process.execPath, ['scripts/build-vista.mjs', '--watch'], { stdio: 'inherit' });
const servidor = spawn('npx', ['tsx', 'watch', 'src/server.ts'], { stdio: 'inherit', shell: true });

const parar = () => { vista.kill(); servidor.kill(); process.exit(); };
process.on('SIGINT', parar);
process.on('SIGTERM', parar);
servidor.on('exit', parar);
