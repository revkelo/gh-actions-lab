# gh-actions-lab

Laboratorio para aprender **GitHub Actions y YAML** de cero, en 5 lecciones incrementales.

La app es deliberadamente trivial (un servidor HTTP de ~40 líneas, sin dependencias) para que el protagonista sean los workflows, no el código.

## La app

| Endpoint | Respuesta |
|---|---|
| `GET /health` | `{"status":"ok","version":"dev"}` |
| `GET /api/sum?a=2&b=3` | `{"result":5}` |
| `GET /api/slug?text=Hola Mundo` | `{"slug":"hola-mundo"}` |

```bash
npm ci      # instala (no hay deps, es instantáneo)
npm test    # runner nativo de Node, sin vitest ni jest
npm start   # http://localhost:3000
```

## Las 5 lecciones

Cada archivo en `.github/workflows/` está comentado línea por línea. Léelos **en orden**.

| # | Archivo | Qué aprendes | Cómo se dispara |
|---|---|---|---|
| 1 | `01-hola.yml` | Anatomía: `on`/`jobs`/`steps`, inputs, contextos `${{ }}`, outputs entre steps, step summary | Manual |
| 2 | `02-ci.yml` | El CI real: checkout, cache de npm, `needs`, `concurrency`, smoke test con `curl` | PR y push a `main` |
| 3 | `03-matrix.yml` | `strategy.matrix`, `include`/`exclude`, `fail-fast`, artifacts, `needs.<job>.result` | PR y manual |
| 4 | `04-postgres.yml` | `services:` con Postgres + healthcheck, secrets, variables de entorno | PR y manual |
| 5 | `05-docker.yml` | Buildx, cache de capas, tags automáticos, push a GHCR con `GITHUB_TOKEN` | Push a `main`, tags, PR |

## Orden de trabajo sugerido

1. **Lección 1 a mano.** Ve a *Actions → 01 - Hola Actions → Run workflow*. Cambia los inputs y observa cómo cambia la salida. Abre el run y mira los contextos que imprimió.
2. **Crea una rama y un PR.** Ahí se disparan las lecciones 2, 3 y 4 solas. Mira cómo aparecen los checks en el PR.
3. **Rompe algo a propósito.** Cambia un `assert` en `src/lib.test.js` para que falle y abre otro PR. Aprende a leer un run rojo.
4. **Mergea a `main`.** Se dispara la lección 5 y tu imagen aparece en la pestaña *Packages* del repo.
5. **Crea un tag** `git tag v1.0.0 && git push --tags` y observa los tags semver que genera `metadata-action`.

## Trampas de YAML que te van a morder

```yaml
# 1. Indentación con TABS = error. Solo espacios, siempre 2.

# 2. Estos valores se parsean como booleano, no como string:
valor: on        # -> true (por eso 'on:' es especial)
valor: no        # -> false
version: 3.10    # -> número 3.1, ¡se come el cero!
version: "3.10"  # -> string correcto

# 3. Multilínea: | conserva saltos de línea, > los colapsa en espacios.
script: |
  linea 1
  linea 2        # dos líneas
options: >-
  --health-cmd "pg_isready"
  --health-interval 5s   # una sola línea

# 4. Los dos puntos dentro de un string sin comillas rompen el parseo:
run: echo Error: algo falló     # MAL
run: "echo Error: algo falló"   # BIEN
```

## Ejercicios

- [ ] Agrega un endpoint `/api/upper?text=hola` con su test y comprueba que el CI lo valida.
- [ ] Haz que la lección 2 falle si el coverage baja de 80% (`npm run test:coverage`).
- [ ] Agrega `macos-latest` a la matriz de la lección 3 y mira cuánto tarda.
- [ ] Cambia la lección 4 para que use `${{ secrets.PG_PASSWORD }}` y crea el secret en *Settings → Secrets*.
- [ ] En la lección 5, agrega build multiplataforma con `platforms: linux/amd64,linux/arm64`.
- [ ] Extrae los 3 steps repetidos (checkout + setup-node + npm ci) a una **composite action** en `.github/actions/setup/action.yml`.

## Siguiente paso

Cuando domines esto, aplica las lecciones 2 y 4 al CI de `autoreel` (hoy no ejecuta Playwright ni buildea los Dockerfiles), y sigue con Jenkins → Grafana → AWS.
