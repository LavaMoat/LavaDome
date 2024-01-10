import {toUpperCase} from './native.mjs';

const letters = 'abcdefghijklmnopqrstuvwxyz';
const digits = '0123456789';
const symbols = '!@#$%^&*()?.;:"\'[]{}+=-_/';
const alphanumeric = letters + digits;
const all = letters + toUpperCase(letters) + digits + symbols;

export const chars = {
    letters,
    digits,
    symbols,
    alphanumeric,
    all,
};