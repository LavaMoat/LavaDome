'use strict';

import {OPTIONS} from './options.mjs';
import {attachShadow, get, set, WeakMap} from './native.mjs';

const shadows = new WeakMap();

export function getShadow(host, opts) {
    const {
        unsafeOpenModeShadow,
        isInnerInstance,
    } = opts;

    // cache shadows for efficient reuse
    let shadow = get(shadows, host);
    if (!shadow) {
        const mode = {mode: 'closed'};
        if (unsafeOpenModeShadow) {
            mode.mode = 'open';
            if (!isInnerInstance) {
                console.warn('LavaDome:',
                    `Initiated with "${OPTIONS.unsafeOpenModeShadow}" set to true.`,
                    'This leaves LavaDome fully vulnerable, ONLY USE FOR TESTING!',
                );
            }
        }
        shadow = attachShadow(host, mode);
        set(shadows, host, shadow);
    }

    return shadow;
}