'use strict';

import {
    Map, Error,
    defineProperties,
    from, stringify,
    attachShadow,
    createElement,
    appendChild,
    textContentSet,
    map, at, get, set,
} from './native.mjs';
import {distraction, unselectable} from './element.mjs';

const shadows = new Map();

export function LavaDome(host) {
    // make exported API tamper-proof
    defineProperties(this, {text: {value: text}});

    // cache shadows for efficient reuse
    let shadow = get(shadows, host);
    if (!shadow) {
        shadow = attachShadow(host, {mode:'closed'});
        set(shadows, host, shadow);
    }

    // child of the shadow, where the secret is set, must be unselectable
    const child = unselectable();
    appendChild(shadow, child);

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
            new LavaDome(span).text(char);
            appendChild(child, span);
        });

        // add a distraction against side channel leaks attack attempts
        appendChild(child, distraction());
    }
}