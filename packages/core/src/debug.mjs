import {OPTIONS} from './options.mjs';
import {from, map} from './native.mjs';

// Attempt to reconstruct LavaDome instance secret given its original root - an unsafe
// method only expected to work when 'unsafeOpenModeShadow' debug-only option is enabled
function getTextByRoot(root) {
    // will remain empty when 'unsafeOpenModeShadow' is disabled
    let text = '';

    console.warn('LavaDome:',
        `Call this function for testing/debugging purposes only!`,
        `Remember, '${OPTIONS.unsafeOpenModeShadow}' must be enabled for this function to work`
    );

    const shadow = root?.shadowRoot;
    if (!shadow) {
        return text;
    }

    const parts = from(shadow.querySelectorAll('span'));
    map(parts, node => {
        const part = node?.shadowRoot?.firstChild?.textContent;
        if (part) text += part;
    });

    return text;
}

export const LavaDomeDebug = {
    getTextByRoot,
}