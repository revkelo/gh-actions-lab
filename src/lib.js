// Funciones puras: facil de testear, que es justo lo que queremos en CI.

/** Suma dos numeros. Lanza si alguno no es un numero finito. */
export function sum(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new TypeError('sum() espera dos numeros finitos');
  }
  return a + b;
}

/** Convierte un texto en un slug apto para URLs. */
export function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '') // quita tildes y diacriticos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
