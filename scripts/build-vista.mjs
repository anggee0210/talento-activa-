// Compila el TypeScript del navegador (src/view/**/main.ts) a src/view/public/js.
// Uso: node scripts/build-vista.mjs [--watch]
import * as esbuild from 'esbuild';

const opciones = {
  entryPoints: { buscador: 'src/view/buscador/main.ts' },
  outdir: 'src/view/public/js',
  bundle: true,
  format: 'esm',
  target: 'es2022',
  sourcemap: true,
  logLevel: 'info',
};

if (process.argv.includes('--watch')) {
  const ctx = await esbuild.context(opciones);
  await ctx.watch();
} else {
  await esbuild.build(opciones);
}
