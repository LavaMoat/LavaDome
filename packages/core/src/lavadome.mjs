'use strict';

import {OPTIONS, options} from './options.mjs';
import {
    Error, map, at,
    defineProperties,
    from, stringify,
    createElement,
    appendChild,
    textContentSet,
    WeakMap, create, set, get
} from './native.mjs';
import {distraction, unselectable} from './element.mjs';
import {getShadow} from './shadow.mjs';


// there's no code running earlier 
const STORE = new WeakMap();

export const envelope = (secret) => {
    const en = create(null);
    set(STORE, en, secret);
    return en;
};


export function LavaDome(host, opts) {
    opts = options(opts);
    
    // make exported API tamper-proof
    defineProperties(this, {
        text: {value: text, writable: false, configurable: false},
        envelope: {value: envelope, writable: false, configurable: false},
    });

    // child of the shadow, where the secret is set, must be unselectable
    const child = unselectable();
    const shadow = getShadow(host, opts);
    appendChild(shadow, child);

    function envelope(anEnvelope) {
        if (typeof anEnvelope !== 'object') {
            throw new Error(
                `LavaDome: first argument must be an object, instead got ${stringify(anEnvelope)}`);
        }
        const secret = get(STORE, anEnvelope);
        if (secret === undefined) {
            throw new Error(
                `LavaDome: first argument must be an envelope`);
        }
        text(secret);
    }

    function text(text) {
        if (typeof text !== 'string') {
            throw new Error(
                `LavaDome: first argument must be a string, instead got ${stringify(text)}`);
        }

        // check if text is a single char and if so, either is part of a longer secret
        // which is protected by the parent LavaDome, or simply a single char provided by
        // consumer either way - not worth attempting to secure
        if (at(from(text), 1) === undefined) {
            return textContentSet(child, text);
        }

        // place each char of the secret in its own LavaDome protection instance
        map(from(text), char => {
            const span = createElement(document, 'span');
            // mark as internal LavaDome instance
            opts[OPTIONS.isInnerInstance] = true;
            new LavaDome(span, opts).text(char);
            appendChild(child, span);
        });

        // add a distraction against side channel leaks attack attempts
        appendChild(child, distraction());
    }
}