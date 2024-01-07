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
    defineProperties(this, {text: {value: text}});

    let shadow = get(shadows, host);
    if (!shadow) {
        shadow = attachShadow(host, {mode:'closed'});
        set(shadows, host, shadow);
    }

    const child = unselectable();
    appendChild(shadow, child);

    function text(text) {
        if (typeof text !== 'string') {
            throw new Error(`LavaDome: first argument must be a string, instead got ${stringify(text)}`);
        }
        if (at(from(text), 1) === undefined) {
            return textContentSet(child, text)
        }
        map(from(text), char => {
            const span = createElement(document, 'span');
            new LavaDome(span).text(char);
            appendChild(child, span);
        });
        appendChild(child, distraction());
    }
}