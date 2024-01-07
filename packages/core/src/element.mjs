'use strict';

import {
    Array,
    createElement,
    entries, from,
    join, keys, map,
    parseInt, random,
    setAttribute,
    textContentSet,
    toFixed,
    toUpperCase,
} from './native.mjs';

const letters = 'abcdefghijklmnopqrstuvwxyz';
const digits = '0123456789';
const symbols = '!@#$%^&*()?.;:"\'[]{}+=-_/';
const alphanumeric = letters + digits;
const all = letters + toUpperCase(letters) + digits + symbols;

const randChar = (f, n) => f[parseInt(toFixed(random() * n))];
const rand = len => randChar(letters, 26) +
    join(map(from(keys(Array(len))), () => randChar(alphanumeric, 36)), '');

function creator(style, tag, text = '') {
    style = join(map(entries(style), ([k,v]) => `${k}: ${v} !important`), '; ');
    return function () {
        const node = createElement(document, tag());
        setAttribute(node, 'style', style);
        textContentSet(node, text);
        return node;
    };
}

const invoker = creator => () => creator();

export const unselectable = invoker(creator({
    '-webkit-user-modify': 'unset',
    '-webkit-user-select': 'none',
    'user-select': 'none',
}, () => rand(7)));

export const distraction = invoker(creator({
    'top': '-10px',
    'right': '-10px',
    'font-size': '1px',
    'position': 'fixed',
}, () => 'span', all));