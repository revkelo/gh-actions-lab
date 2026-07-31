import { createServer } from 'node:http';
import { sum, slugify } from './lib.js';

const PORT = Number(process.env.PORT ?? 3000);

const json = (res, code, body) => {
  res.writeHead(code, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
};

export const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);

  // El endpoint que usan el HEALTHCHECK de Docker y el smoke test de CI.
  if (url.pathname === '/health') {
    return json(res, 200, { status: 'ok', version: process.env.APP_VERSION ?? 'dev' });
  }

  if (url.pathname === '/api/sum') {
    const a = Number(url.searchParams.get('a'));
    const b = Number(url.searchParams.get('b'));
    try {
      return json(res, 200, { result: sum(a, b) });
    } catch (err) {
      return json(res, 400, { error: err.message });
    }
  }

  if (url.pathname === '/api/slug') {
    return json(res, 200, { slug: slugify(url.searchParams.get('text') ?? '') });
  }

  return json(res, 404, { error: 'not found' });
});

// Solo escuchamos si el archivo se ejecuta directo, no cuando lo importa un test.
if (process.argv[1]?.endsWith('server.js')) {
  server.listen(PORT, () => console.log(`escuchando en http://localhost:${PORT}`));
}
