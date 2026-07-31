// Usamos el runner nativo de Node (node --test): cero dependencias que instalar.
import test from 'node:test';
import assert from 'node:assert/strict';
import { sum, slugify } from './lib.js';

test('sum suma dos enteros', () => {
  assert.equal(sum(2, 3), 5);
});

test('sum funciona con negativos y decimales', () => {
  assert.equal(sum(-1, 1), 0);
  assert.equal(sum(0.1, 0.2).toFixed(2), '0.30');
});

test('sum rechaza valores no numericos', () => {
  assert.throws(() => sum('2', 3), TypeError);
  assert.throws(() => sum(NaN, 1), TypeError);
});

test('slugify limpia acentos y espacios', () => {
  assert.equal(slugify('  Hola Mundo DevOps  '), 'hola-mundo-devops');
  assert.equal(slugify('Canción de Ñoño'), 'cancion-de-nono');
});

test('slugify colapsa separadores repetidos', () => {
  assert.equal(slugify('a---b___c'), 'a-b-c');
});
