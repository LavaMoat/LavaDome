'use strict';

import {OPTIONS, options} from './options.mjs';
import {
    Error, map, at,
    defineProperties,
    from, stringify,
    createElement,
    appendChild,
    replaceChildren,
    textContentSet,
    addEventListener,
    ownerDocument,
} from './native.mjs';
import {distraction, loadable, unselectable} from './element.mjs';
import {getShadow} from './shadow.mjs';

export function LavaDome(host, opts) {
    opts = options(opts);
    
    // make exported API tamper-proof
    defineProperties(this, {text: {value: text}});

    // get/create shadow for host (empty shadow content if there's any already)
    const shadow = getShadow(host, opts);
    replaceChildren(shadow);

    // fire everytime instance is reloaded and bail if occurs under non-top documents
    const ifr = loadable();
    addEventListener(ifr, 'load', () =>
        ownerDocument(ifr) !== document && replaceChildren(shadow));

    // child of the shadow, where the secret is set, must be unselectable
    const child = unselectable();
    appendChild(shadow, child);

    function text(text) {
        if (typeof text !== 'string') {
            throw new Error(
                `LavaDomeCore: first argument must be a string, instead got ${stringify(text)}`);
        }

        // check if text is a single char and if so, either is part of a longer secret
        // which is protected by the parent LavaDome, or simply a single char provided by
        // consumer either way - not worth attempting to secure
        if (at(from(text), 1) === undefined) {
            return textContentSet(child, text);
        }

        // attach loadable only once per instance to avoid excessive load firing
        appendChild(shadow, ifr);

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