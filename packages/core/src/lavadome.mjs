'use strict';

import {OPTIONS, options} from './options.mjs';
import {
    Error, map, at, push,
    defineProperties,
    from, stringify,
    createElement,
    appendChild,
    replaceChildren,
    textContentSet,
    ownerDocument,
    navigation, Array,
    url, destination, includes,
    preventDefault, stopPropagation,
} from './native.mjs';
import {distraction, loadable, hardened} from './element.mjs';
import {getShadow} from './shadow.mjs';

const teardowns = Array();
const teardownAll = () => map(teardowns, t => t());

// text-fragments links can be abused to leak shadow internals - block in-app redirection to them
navigation?.addEventListener('navigate', event => {
    const dest = url(destination(event));
    if (includes(dest, ':~:')) {
        preventDefault(event);
        stopPropagation(event);
        throw new Error(
            `LavaDomeCore: in-app redirection to text-fragments links is blocked to ensure security`);
    }
    teardownAll();
});

addEventListener('pagehide', teardownAll);

export function LavaDome(host, opts) {
    opts = options(opts);
    
    // make exported API tamper-proof
    defineProperties(this, {text: {value: text}});

    // get/create shadow for host (empty shadow content if there's any already)
    const shadow = getShadow(host, opts);
    replaceChildren(shadow);

    // LavaDome teardown invoker
    const teardown = () => replaceChildren(shadow);

    // fire every time instance is reloaded and abort loading for non-top documents
    const attach = loadable(element => {
        const ownerDoc = ownerDocument(element);
        if (ownerDoc !== document) {
            teardown();
            throw new Error(`LavaDomeCore: ` +
                `The document to which LavaDome was originally introduced ` +
                `must be the same as the one this instance is inserted to`);
        }
    });

    // child of the shadow, where the secret is set, must be hardened
    const child = hardened();
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
        attach(shadow);

        // add to list of future teardowns
        push(teardowns, teardown);

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
