"use strict";

const {
    Object,
    Array,
    Function,
    Math,
    parseInt,
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

const letters = 'abcdefghijklmnopqrstuvwxyz';

// p stands for primordial
function p(obj, prop, accessor, type = 'function') {
    const desc = getOwnPropertyDescriptor(obj, prop);
    switch (type) {
        case 'function':
            return Function.prototype.call.bind(desc[accessor]);
            break;
    }
}

function generateRandomString(len = 0, from = letters, fromLength = 26) {
    let tag = '';
    for (let i = 0; i < len; i++) {
        const r = parseInt(random() * (fromLength));
        tag += letters[r];
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
const join = p(Array.prototype, 'join', 'value');

const shadows = new Map();

export function LavaDome(root) {
    let host = root, inner = null, style = null;

    this.text = text; this.char = char;

    let shadow = shadows.get(host);
    if (!shadow) {
        shadow = attachShadow(host, { mode: 'closed' });
        shadows.set(host, shadow);
    }

    empty();

    function empty() {
        innerHTMLSet(shadow, '');
    }

    function resetStyle(tag, id, clas) {
        style = createElement(document, 'style');
        const s = join(map(entries(css), ([k,v]) => `${k}: ${v} !important`), '; ');
        textContentSet(style, `${tag}#${id}.${clas} { ${style} }`);
        appendChild(shadow, style);
        return s;
    }

    function reset() {
        empty();
        const tag = generateRandomString(7);
        const id = generateRandomString(7);
        const clas = generateRandomString(7);
        const style = resetStyle(tag, id, clas);
        inner = createElement(document, tag);
        setAttribute(inner, 'id', id);
        setAttribute(inner, 'class', clas);
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
        const chars = text.split('');
        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            const s = document.createElement('span');
            const ld = new LavaDome(s);
            ld.char(char);
            inner.appendChild(s);
        }
    }
}