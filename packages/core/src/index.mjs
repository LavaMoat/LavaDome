"use strict";

const {
    Object,
    Array,
    Function,
    Math,
    parseInt,
    Map,
} = window;

const {
    getOwnPropertyDescriptor,
    entries,
} = Object;

const {
    random,
} = Math;

const css = Object.create(null);
css['-webkit-user-modify'] = 'unset';
css['user-select'] = 'none';

const opts = Object.create(null);
opts.mode = 'closed';

const letters = 'abcdefghijklmnopqrstuvwxyz';
const nums = '0123456789';

// p stands for primordial
function p(obj, prop, accessor, type = 'function') {
    const desc = getOwnPropertyDescriptor(obj, prop);
    switch (type) {
        case 'function':
            return Function.prototype.call.bind(desc[accessor]);
            break;
    }
}

function generateRandomString(len = 1) {
    let tag = letters[parseInt(random() * (26))];
    for (let i = 1; i < len; i++) {
        const r = parseInt(random() * (36));
        tag += (letters+nums)[r];
    }
    return tag;
}

const attachShadow = p(Element.prototype, 'attachShadow', 'value');
const createElement = p(Document.prototype, 'createElement', 'value');
const appendChild = p(Node.prototype, 'appendChild', 'value');
const textContentSet = p(Node.prototype, 'textContent', 'set');
const innerHTMLSet = p(ShadowRoot.prototype, 'innerHTML', 'set');
const setAttribute = p(Element.prototype, 'setAttribute', 'value');
const map = p(Array.prototype, 'map', 'value');
const split = p(String.prototype, 'split', 'value');
const join = p(Array.prototype, 'join', 'value');
const get = p(Map.prototype, 'get', 'value');
const set = p(Map.prototype, 'set', 'value');

const shadows = new Map();

export function LavaDome(root) {
    let host = root, inner = null;

    this.text = text; this.char = char;

    let shadow = get(shadows, host);
    if (!shadow) {
        shadow = attachShadow(host, opts);
        set(shadows, host, shadow);
    }

    empty();

    function empty() {
        innerHTMLSet(shadow, '');
    }

    function reset() {
        empty();
        const tag = generateRandomString(7);
        const style = join(map(entries(css), ([k,v]) => `${k}: ${v} !important`), '; ');
        inner = createElement(document, tag);
        setAttribute(inner, 'style', style);
    }

    function init() {
        reset();
        appendChild(shadow, inner);
    }

    function char(char) {
        init();
        textContentSet(inner, char);
    }

    function text(text) {
        init();
        const chars = split(text, '');
        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            const s = createElement(document, 'span');
            const ld = new LavaDome(s);
            ld.char(char);
            appendChild(inner, s);
        }
    }
}