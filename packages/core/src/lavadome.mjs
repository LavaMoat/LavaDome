'use strict';

import {OPTIONS, options} from './options.mjs';
import {
    Error, map, at, TypeError,
    defineProperties,
    from,
    createElement,
    appendChild,
    replaceChildren,
    textContentSet,
    Blob, ClipboardItem,
    write, clipboard,
    addEventListener,
    ownerDocument,
    navigation,
    url, destination, includes,
    preventDefault, stopPropagation,
} from './native.mjs';
import {distraction, loadable, hardened} from './element.mjs';
import {getShadow} from './shadow.mjs';

// text-fragments links can be abused to leak shadow internals - block in-app redirection to them
navigation?.addEventListener('navigate', event => {
    const dest = url(destination(event));
    if (includes(dest, ':~:')) {
        preventDefault(event);
        stopPropagation(event);
        throw new Error(
            `LavaDomeCore: in-app redirection to text-fragments links is blocked to ensure security`);
    }
});

export function LavaDome(host, opts) {
    opts = options(opts);
    
    // make exported API tamper-proof
    defineProperties(this, {
        text: {value: text},
        copy: {value: copy},
    });

    // get/create shadow for host (empty shadow content if there's any already)
    const shadow = getShadow(host, opts);
    replaceChildren(shadow);

    // fire every time instance is reloaded and abort loading for non-top documents
    const iframe = loadable();
    addEventListener(iframe, 'load', () => {
        const ownerDoc = ownerDocument(iframe);
        if (ownerDoc !== document) {
            replaceChildren(shadow);
            throw new Error(`LavaDomeCore: ` +
                `The document to which LavaDome was originally introduced ` +
                `must be the same as the one this instance is inserted to`);
        }
    });

    // child of the shadow, where the secret is set, must be hardened
    const child = hardened();
    appendChild(shadow, child);

    let secret = '';

    function text(input) {
        const type = typeof input;
        if (type !== 'string') {
            throw new TypeError(
                `LavaDomeCore: first argument must be a string, instead got ${type}`);
        }

        // check if text is a single char and if so, either is part of a longer secret
        // which is protected by the parent LavaDome, or simply a single char provided by
        // consumer either way - not worth attempting to secure
        if (at(from(input), 1) === undefined) {
            return textContentSet(child, input);
        }

        secret = input;

        // attach loadable only once per instance to avoid excessive load firing
        appendChild(shadow, iframe);

        // place each char of the secret in its own LavaDome protection instance
        map(from(input), char => {
            const span = createElement(document, 'span');
            // mark as internal LavaDome instance
            opts[OPTIONS.isInnerInstance] = true;
            new LavaDome(span, opts).text(char);
            appendChild(child, span);
        });

        // add a distraction against side channel leaks attack attempts
        appendChild(child, distraction());
    }

    async function copy() {
        const type = 'text/plain';
        const blob = new Blob([secret], {type});
        const data = [new ClipboardItem({[type]: blob})];
        await write(clipboard, data);
    }
}
