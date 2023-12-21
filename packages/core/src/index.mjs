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

export class LavaDome {
    constructor(root) {
        this.outer = root;
        this.inner = null;
        this.style = null;
        this.shadow = shadows.get(this.outer);
        if (!this.shadow) {
            this.shadow = attachShadow(this.outer, { mode: 'closed' });
            shadows.set(this.outer, this.shadow);
        }
        this.#empty();
    }

    #empty() {
        innerHTMLSet(this.shadow, '');
    }

    #resetStyle(tag, id, clas) {
        this.style = createElement(document, 'style');
        const style = join(map(entries(css), ([k,v]) => `${k}: ${v} !important`), '; ');
        textContentSet(this.style, `${tag}#${id}.${clas} { ${style} }`);
        appendChild(this.shadow, this.style);
        return style;
    }

    #reset() {
        this.#empty();
        const tag = generateRandomString(7);
        const id = generateRandomString(7);
        const clas = generateRandomString(7);
        const style = this.#resetStyle(tag, id, clas);
        this.inner = createElement(document, tag);
        setAttribute(this.inner, 'id', id);
        setAttribute(this.inner, 'class', clas);
        setAttribute(this.inner, 'style', style);
    }

    #init() {
        this.#reset();
        appendChild(this.shadow, this.inner);
    }

    text(text) {
        this.#init();
        textContentSet(this.inner, text);
    }
}